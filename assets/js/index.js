function toggleHistoryOpen() {
  document.querySelector(".history").classList.toggle("open");
  const icon = document.querySelector("#history-toggle-icon");
  icon.className === "fa fa-angle-down"
    ? (icon.className = "fa fa-angle-up")
    : (icon.className = "fa fa-angle-down");
}
