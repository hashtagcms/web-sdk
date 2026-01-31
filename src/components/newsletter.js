export default class Newsletter {
    constructor() {
        this.elements = {
            close: "span[data-class='newsletter-close']",
            message: "span[data-class='newsletter-message']", 
            form: "form[data-form='newsletter-form']",
            messageHolder: "div[data-message-holder='newsletter-message-holder']"
        };
        
        // Backward compatibility: Use 'subscribe' selectors if 'newsletter' form is not found
        if (!document.querySelector(this.elements.form)) {
             this.elements = {
                close: "span[data-class='subscribe-close']",
                message: "span[data-class='subscribe-message']", 
                form: "form[data-form='subscribe-form']",
                messageHolder: "div[data-message-holder='subscribe-message-holder']"
            };
        }

        this.init();
    }

    init() {

        if (document.querySelector(this.elements.close)) {
            document.querySelector(this.elements.close).addEventListener('click', (ele) => {
                document.querySelector(this.elements.messageHolder).style.display = "none";
            });
        }
    }

    newsletterNow() {
        let showMessage = function (message) {
            document.querySelector($this.elements.message).innerText = message;
        }
        let $this = this;
        let afterSave = function (data) {
            console.log("data ", data);
            document.querySelector($this.elements.messageHolder).style.display = "";
            if (data.success == true) {
                showMessage(data.message);
                document.querySelector($this.elements.message).innerText = data.message;
                document.querySelector($this.elements.form + " input[type='email']").value = '';
                document.querySelector($this.elements.message).classList.remove("text-danger");
                document.querySelector($this.elements.message).classList.add("text-success");
            } else {
                let errorMsg = (data.message && data.message.email && data.message.email[0]) ? data.message.email[0] : (data.message || "There is some error.");
                showMessage(errorMsg);
                document.querySelector($this.elements.message).classList.remove("text-success");
                document.querySelector($this.elements.message).classList.add("text-danger");
            }
        }

        let email = document.querySelector(this.elements.form + " input[type='email']");
        let url = "/common/newsletter";
        let data = { email: email.value };
        axios.post(url, data)
            .then(response => {
                afterSave(response.data);
            }).catch((error) => {
                afterSave(error.response.data);
            });

        return false;
    }

    /**
     * Alias for newsletterNow
     * @deprecated
     */
    subscribeNow() {
        return this.newsletterNow();
    }

}
