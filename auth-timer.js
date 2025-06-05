const authModal = document.getElementById("authModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const items = document.querySelectorAll(".countdown-item > h4");
let countdownInterval;

function openAuthModal() {
    authModal.style.display = "flex";
    document.body.classList.add("stop-scrolling");
    startCountdown();
}

function closeAuthModal() {
    authModal.style.display = "none";
    document.body.classList.remove("stop-scrolling");
    clearInterval(countdownInterval);
}

closeModalBtn.addEventListener("click", closeAuthModal);
window.addEventListener("click", (e) => {
    if (e.target === authModal) closeAuthModal();
});
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAuthModal();
});

function startCountdown() {
    let countdownDate;

    const savedDate = localStorage.getItem("authCountdownEnd");

    if (savedDate) {
        countdownDate = new Date(savedDate);
    } else {
        countdownDate = new Date();
        countdownDate.setDate(countdownDate.getDate() + 5);
        localStorage.setItem("authCountdownEnd", countdownDate);
    }

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        const oneDay = 24 * 60 * 60 * 1000;
        const oneHour = 60 * 60 * 1000;
        const oneMinute = 60 * 1000;

        let days = Math.floor(distance / oneDay);
        let hours = Math.floor((distance % oneDay) / oneHour);
        let minutes = Math.floor((distance % oneHour) / oneMinute);
        let seconds = Math.floor((distance % oneMinute) / 1000);

        if (distance < 0) {
            clearInterval(countdownInterval);
            document.querySelector(".countdown").innerHTML = "<h4 class='expired'>Время вышло!</h4>";
            localStorage.removeItem("authCountdownEnd");
            return;
        }

        const values = [days, hours, minutes, seconds];
        items.forEach((item, i) => item.textContent = values[i].toString().padStart(2, "0"));
    }

    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

document.getElementById("registerBtn").addEventListener("click", openAuthModal);
document.getElementById("loginBtn").addEventListener("click", openAuthModal);
