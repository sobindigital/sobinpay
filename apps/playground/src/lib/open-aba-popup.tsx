/**
 * @file ABA PayWay Popup & Hosted Checkout Trigger
 * @author Sobin Digital
 * @license MIT
 *
 * Exact implementation for mounting and opening the ABA PayWay checkout modal or hosted page.
 * Follows ABA PayWay DOM requirements (#Div1, #aba_merchant_request, #checkout_button).
 */

export interface CheckoutPayload {
  actionUrl: string;
  req_time: string;
  merchant_id: string;
  tran_id: string;
  amount: string;
  currency?: "USD" | "KHR" | string;
  payment_option: string;
  return_url: string;
  continue_success_url?: string;
  cancel_url?: string;
  view_type?: string;
  lifetime?: number;
  skip_success_page?: number;
  payment_gate?: number;
  hash: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  items?: string;
  shipping?: string;
}

export const abaHtmlForm = (payment: CheckoutPayload): string => {
  return `<form
        style="display: none"
        class="row g-3"
        target="aba_webservice"
        id="aba_merchant_request"
        method="POST"
        enctype="multipart/form-data"
        action="${payment.actionUrl}"
      >
        <div class="mb-3">
          <input type="hidden" name="req_time" value="${payment.req_time}" />
          <input type="hidden" name="merchant_id" value="${payment.merchant_id}" />
          <input type="hidden" name="tran_id" value="${payment.tran_id}" />
          <div class="col-md-auto">
            <input class="form-control form-control-lg" name="amount" value="${payment.amount}" type="hidden" />
          </div>
          <input type="hidden" name="currency" value="${payment.currency || 'USD'}" />
          <input type="hidden" name="payment_option" value="${payment.payment_option}" />
          <input type="hidden" name="return_url" value="${payment.return_url}" />
          <input type="hidden" name="continue_success_url" value="${payment.continue_success_url || ''}" />
          <input type="hidden" name="cancel_url" value="${payment.cancel_url || ''}" />
          <input type="hidden" name="skip_success_page" value="${payment.skip_success_page ?? 1}" />
          <input type="hidden" name="view_type" value="${payment.view_type || 'popup'}" />
          <input type="hidden" name="payment_gate" value="${payment.payment_gate ?? 0}" />
          <input type="hidden" name="lifetime" value="${payment.lifetime ?? 10}" />
          <input type="hidden" name="hash" value="${payment.hash}" />
          ${payment.firstname ? `<input type="hidden" name="firstname" value="${payment.firstname}" />` : ''}
          ${payment.lastname ? `<input type="hidden" name="lastname" value="${payment.lastname}" />` : ''}
          ${payment.email ? `<input type="hidden" name="email" value="${payment.email}" />` : ''}
          ${payment.phone ? `<input type="hidden" name="phone" value="${payment.phone}" />` : ''}
          ${payment.items ? `<input type="hidden" name="items" value="${payment.items}" />` : ''}
          ${payment.shipping ? `<input type="hidden" name="shipping" value="${payment.shipping}" />` : ''}
        </div>
        <div class="mb-3">
          <button type="button" id="checkout_button" class="btn btn-primary mb-3">
            Checkout
          </button>
        </div>
      </form>`;
};

interface JQueryElement {
  append: (element: unknown) => void;
  remove: () => void;
  val: (value?: string) => string | undefined;
  length: number;
}

interface WindowWithAba extends Window {
  $?: {
    (selector: string): JQueryElement;
  };
  AbaPayway?: {
    checkout: () => void;
  };
}

/**
 * Dynamically ensures that jQuery and ABA PayWay SDK scripts are loaded and available.
 */
async function ensureAbaScriptsLoaded(isSandbox: boolean): Promise<void> {
  if (typeof window === "undefined") return;

  const win = window as WindowWithAba;

  // 1. Ensure jQuery is available
  if (typeof win.$ !== "function") {
    await new Promise<void>((resolve) => {
      const existing = document.querySelector('script[src*="jquery"]');
      if (existing) {
        existing.addEventListener("load", () => resolve());
        setTimeout(resolve, 1200);
      } else {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js";
        script.onload = () => resolve();
        script.onerror = () => resolve();
        document.head.appendChild(script);
      }
    });
  }

  // 2. Helper to check if AbaPayway is defined (either on window or global scope)
  const isAbaLoaded = (): boolean => {
    try {
      if ((window as unknown as { AbaPayway?: { checkout: () => void } }).AbaPayway) return true;
      const fn = Function("return typeof AbaPayway !== 'undefined' ? AbaPayway : undefined");
      return typeof fn() !== "undefined";
    } catch {
      return false;
    }
  };

  if (!isAbaLoaded()) {
    const targetScript = isSandbox
      ? "https://checkout-sandbox.payway.com.kh/plugins/checkout2-0.js"
      : "https://checkout.payway.com.kh/plugins/checkout2-0.js";

    await new Promise<void>((resolve) => {
      const script = document.createElement("script");
      script.src = targetScript;
      script.onload = () => resolve();
      script.onerror = () => {
        // Fallback to alternative host if blocked
        const altScript = document.createElement("script");
        altScript.src = isSandbox
          ? "https://checkout.payway.com.kh/plugins/checkout2-0.js"
          : "https://checkout-sandbox.payway.com.kh/plugins/checkout2-0.js";
        altScript.onload = () => resolve();
        altScript.onerror = () => resolve();
        document.head.appendChild(altScript);
      };
      document.head.appendChild(script);
    });
  }
}

/**
 * Launches the ABA PayWay checkout modal popup.
 */
export async function openABAPopup(payment: CheckoutPayload): Promise<void> {
  if (typeof window === "undefined") return;

  const isSandbox = (payment.actionUrl || "").includes("sandbox");
  await ensureAbaScriptsLoaded(isSandbox);

  // Clean up any existing Div1 modal container
  const existing = document.getElementById("Div1");
  if (existing) existing.remove();

  const html = abaHtmlForm(payment);

  const div = document.createElement("div");
  div.setAttribute("id", "Div1");
  div.innerHTML = html;

  document.body.appendChild(div);

  const win = window as WindowWithAba;

  // Update payment_option from checked option if present (matching user's existing project pattern)
  if (typeof win.$ === "function") {
    try {
      const checked = win.$(".payment_option:checked");
      if (checked.length > 0) {
        const val = checked.val();
        if (val) {
          win.$('#aba_merchant_request input[name="payment_option"]').val(String(val));
        }
      }
    } catch {
      // Ignore if no checked element
    }
  }

  // Retrieve AbaPayway function safely across both window and global scope
  const getAbaCheckout = (): (() => void) | null => {
    try {
      if (win.AbaPayway?.checkout) {
        return () => win.AbaPayway?.checkout();
      }
      const fn = Function("return typeof AbaPayway !== 'undefined' ? AbaPayway : undefined");
      const globalAba = fn();
      if (globalAba?.checkout) {
        return () => globalAba.checkout();
      }
    } catch {
      // Ignore
    }
    return null;
  };

  const checkoutFn = getAbaCheckout();
  if (checkoutFn) {
    checkoutFn();
  } else {
    // If SDK is blocked or couldn't initialize modal, submit via hosted POST form
    console.warn("AbaPayway popup modal could not be triggered. Submitting via hosted checkout.");
    openHostedCheckout(payment);
  }
}

/**
 * Opens ABA PayWay Hosted checkout in a new tab via HTTP POST (avoids HTTP 405 Method Not Allowed).
 */
export function openHostedCheckout(payment: CheckoutPayload): void {
  if (typeof window === "undefined") return;

  // Remove any previously submitted hosted form
  const prevForm = document.getElementById("aba_hosted_checkout_form");
  if (prevForm) prevForm.remove();

  const form = document.createElement("form");
  form.id = "aba_hosted_checkout_form";
  form.method = "POST";
  form.action = payment.actionUrl;
  form.target = "_blank";
  form.style.display = "none";
  form.enctype = "multipart/form-data";

  for (const [key, value] of Object.entries(payment)) {
    if (value === undefined || value === null) continue;
    if (key === "actionUrl") continue;
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = String(value);
    form.appendChild(input);
  }

  // Ensure view_type is hosted
  const viewTypeInput = form.querySelector('input[name="view_type"]') as HTMLInputElement | null;
  if (viewTypeInput) {
    viewTypeInput.value = "hosted";
  } else {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "view_type";
    input.value = "hosted";
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
  setTimeout(() => form.remove(), 2000);
}

export default openABAPopup;
