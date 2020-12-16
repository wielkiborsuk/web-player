export function formatTime(time) {
  if (!time) {
    return "00:00";
  }
  const totalSeconds = Math.round(time);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);

  return `${hours ? zeroPad(hours)+':' : ''}${zeroPad(minutes)}:${zeroPad(seconds)}`;
}

function zeroPad(number) {
  return ('0' + number).slice(-2);
}
