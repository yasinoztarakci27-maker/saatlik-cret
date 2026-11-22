const $ = (id) => document.getElementById(id);
const fields = ["start", "end", "rate", "days", "currency"];

function money(value, symbol) {
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value) + " " + symbol;
}

function calculate() {
  const start = $("start").value;
  const end = $("end").value;
  const rate = Number($("rate").value);
  const days = Number($("days").value);
  const symbol = $("currency").value;
  const error = $("error");

  error.style.display = "none";
  error.textContent = "";

  if (!start || !end) return showError("Lütfen işe giriş ve çıkış saatlerini gir.");
  if (!Number.isFinite(rate) || rate < 0 || $("rate").value.trim() === "") return showError("Saatlik ücret sıfır veya daha büyük bir sayı olmalı.");
  if (!Number.isInteger(days) || days < 1 || days > 31) return showError("Gün sayısı 1 ile 31 arasında tam sayı olmalı.");

  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  let duration = endMinutes - startMinutes;
  if (duration < 0) duration += 24 * 60;
  if (duration === 0) return showError("Giriş ve çıkış saati aynı olamaz.");

  const hours = duration / 60;
  const dailyPay = hours * rate;
  const totalPay = dailyPay * days;
  const wholeHours = Math.floor(duration / 60);
  const remainingMinutes = duration % 60;

  $("total").textContent = money(totalPay, symbol);
  $("dailyTime").textContent = `${wholeHours} saat ${remainingMinutes} dakika`;
  $("dailyPay").textContent = money(dailyPay, symbol);
  $("totalTime").textContent = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2 }).format(hours * days) + " saat";
  $("totalDays").textContent = days + (days === 1 ? " gün" : " gün");
}

function showError(message) {
  $("error").textContent = message;
  $("error").style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
  $("calculate").addEventListener("click", calculate);
  fields.forEach(id => $(id).addEventListener("input", calculate));
  $("currency").addEventListener("change", calculate);

  $("reset").addEventListener("click", () => {
    $("start").value = "15:00";
    $("end").value = "23:30";
    $("rate").value = "130";
    $("days").value = "1";
    $("currency").value = "₺";
    calculate();
  });

  calculate();
});
