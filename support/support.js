const supportForm = document.querySelector("[data-support-form]");
const appSelect = document.querySelector("[data-app-select]");
const requestTypeSelect = document.querySelector("[data-request-type-select]");
const formNotice = document.querySelector("[data-form-notice]");

function addOptions(select, options) {
  options.forEach((option) => {
    const element = document.createElement("option");
    element.value = option.id;
    element.textContent = option.name;
    select.appendChild(element);
  });
}

async function loadSupportOptions() {
  if (!appSelect || !requestTypeSelect) return;

  try {
    const response = await fetch("/support/options.json", { cache: "no-cache" });
    if (!response.ok) throw new Error("Could not load support options");

    const options = await response.json();
    addOptions(appSelect, options.apps || []);
    addOptions(requestTypeSelect, options.requestTypes || []);
  } catch (error) {
    addOptions(appSelect, [{ id: "general", name: "General app support" }]);
    addOptions(requestTypeSelect, [{ id: "help", name: "Help using the app" }]);
    if (formNotice) {
      formNotice.textContent = "Some choices could not be loaded, but you can still send your message.";
    }
  } finally {
    appSelect.disabled = false;
    requestTypeSelect.disabled = false;
  }
}

function selectedLabel(select) {
  return select.options[select.selectedIndex]?.textContent.trim() || "App";
}

if (supportForm) {
  supportForm.addEventListener("submit", () => {
    const subject = supportForm.querySelector('input[name="_subject"]');
    const submitButton = supportForm.querySelector('button[type="submit"]');
    const firstName = supportForm.elements.first_name.value.trim();
    const lastName = supportForm.elements.last_name.value.trim();

    subject.value = `[App Support] ${selectedLabel(appSelect)} — ${selectedLabel(requestTypeSelect)} — ${firstName} ${lastName}`;
    submitButton.disabled = true;
    submitButton.textContent = "Sending…";
  });
}

loadSupportOptions();
