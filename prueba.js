const now = new Date();
let twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000)); // Resta 24 horas a la hora actual

// Obtenemos los componentes de la fecha y hora
let year = twentyFourHoursAgo.getFullYear();
let month = String(twentyFourHoursAgo.getMonth() + 1).padStart(2, '0'); // Sumamos 1 al mes porque los meses van de 0 a 11
let day = String(twentyFourHoursAgo.getDate()).padStart(2, '0');
let hours = String(twentyFourHoursAgo.getHours()).padStart(2, '0');
let minutes = String(twentyFourHoursAgo.getMinutes()).padStart(2, '0');
let seconds = String(twentyFourHoursAgo.getSeconds()).padStart(2, '0');

// Concatenamos los componentes en el formato deseado
let formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

console.log(formattedDate);
