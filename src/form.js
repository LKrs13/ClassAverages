function getItem() {
    const formId = "";
    const form = FormApp.openById(formId);
    const formResponses = form.getResponses();
    const lastResponse = formResponses[formResponses.length - 1];
    const lastResponseItems = lastResponse.getItemResponses();
    const item = lastResponseItems[1];
    FormApp.getActiveForm().deleteResponse(lastResponse.getId());
    return item
  }