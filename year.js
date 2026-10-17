const yearElement = document.getElementById('current-year');
const updateYear = () => { yearElement.textContent = String(new Date().getFullYear()); };
updateYear();
document.addEventListener('visibilitychange', updateYear);
setInterval(updateYear, 60 * 60 * 1000);
