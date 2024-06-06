document.getElementById('captchaForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const apiKey = document.getElementById('apiKey').value;

    const taskData = {
        "clientKey": apiKey,
        "task": {
            "type": "RecaptchaV3TaskProxyless",
            "websiteURL": "https://2captcha.com/demo/recaptcha-v3",
            "websiteKey": "6LfB5_IbAAAAAMCtsjEHEHKqcB9iQocwwxTiihJu",
            "minScore": 0.9,
            "pageAction": "test",
            "isEnterprise": false,
            "apiDomain": "www.recaptcha.net"
        }
    };

    fetch('https://api.2captcha.com/createTask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.errorId === 0) {
            document.getElementById('response').innerText = 'Task created. Waiting for solution...';

            const taskId = data.taskId;
            checkTaskResult(apiKey, taskId);
        } else {
            document.getElementById('response').innerText = 'Error: ' + data.errorDescription;
        }
    })
    .catch(error => {
        document.getElementById('response').innerText = 'Request failed: ' + error;
    });
});

function checkTaskResult(apiKey, taskId) {
    fetch('https://api.2captcha.com/getTaskResult', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "clientKey": apiKey,
            "taskId": taskId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.errorId === 0) {
            if (data.status === 'ready') {
                document.getElementById('response').innerText = 'Solution: ' + data.solution.gRecaptchaResponse;
            } else {
                setTimeout(() => {
                    checkTaskResult(apiKey, taskId);
                }, 5000); // Check again after 5 seconds
            }
        } else {
            document.getElementById('response').innerText = 'Error: ' + data.errorDescription;
        }
    })
    .catch(error => {
        document.getElementById('response').innerText = 'Request failed: ' + error;
    });
}
