const form = document.getElementById("requestForm");

if (form) {

    form.addEventListener("submit", async function(event) {

        event.preventDefault();

        const requestData = {

            name: document.getElementById("name").value,

            phone: document.getElementById("phone").value,

            waste_category:
                document.getElementById("waste_category").value,

            pickup_address:
                document.getElementById("pickup_address").value,

            pickup_date:
                document.getElementById("pickup_date").value,

            pickup_time:
                document.getElementById("pickup_time").value,

            description:
                document.getElementById("description").value
        };

        try {

            const response = await fetch("/api/requests", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(requestData)
            });

            const result = await response.json();

            const message =
                document.getElementById("message");

            if (response.ok) {

                message.innerHTML =
                    `✅ Request submitted successfully!
                     <br>
                     Your Request ID is:
                     <strong>${result.id}</strong>`;

                form.reset();

            } else {

                message.innerHTML =
                    `❌ ${result.error}`;
            }

        } catch (error) {

            console.error(error);

            document.getElementById("message").innerHTML =
                "❌ Unable to submit request.";

        }

    });

}