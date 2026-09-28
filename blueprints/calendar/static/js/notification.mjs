export async function showNotification(title, options = {}) {
  if(!("Notification" in window)) return;
  if(Notification.permission !== "granted"){
    await Notification.requestPermission();
  }
  if(Notification.permission !== "granted") return;
  const swReg = navigator.serviceWorker?.controller
  ? await navigator.serviceWorker.getRegistration()
  : null;
  if (swReg !== null){
    await swReg.showNotification(title, options);
  } else{
    new Notification(title, options);
  }
}