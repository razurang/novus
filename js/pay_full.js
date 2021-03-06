
var Webflow = Webflow || [];
Webflow.push(function () {
   // DOMready has fired
   // May now use jQuery and Webflow api

   const payForm = $('#wf-form-pay-form'),
      workType = payForm.find('#solo-or-team'),
      weeklyPayElem = $('#weekly-pay'),
      annualPayElem = $('#annual-pay'),

      workTypeSolo = 'Solo',
      workTypeTeam = 'Team',

      miles2500 = 2500,
      miles3000 = 3000,
      miles3500 = 3500,
      miles4500 = 4500,
      miles6000 = 6000,
      miles8000 = 8000;

   let miles = document.getElementById('miles');

   defaultSoloOptions();

   workType.change(checkWorkType);
   miles.addEventListener('change', makeCalc);

   function checkWorkType() {
      if (workType.val() == workTypeTeam) {
         showTeamMiles();
         makeCalc();
      } else {
         showSoloMiles();
         makeCalc();
      }
   }

   function makeCalc() {
      if (workType.val() == workTypeSolo && miles.value == miles2500) {
         let weeklyPay = '$1,125 to $1,500';
         let annualPay = '$62,475 to $76,500';
         updateCalcInfo(weeklyPay, annualPay);
         _logEvent('pay:change', { 'driverType': 'solo', 'miles': '2500' });
      } else if (workType.val() == workTypeSolo && miles.value == miles3000) {
         let weeklyPay = '$1,510 to $1,820';
         let annualPay = '$77,100 to $92,820';
         updateCalcInfo(weeklyPay, annualPay);
         _logEvent('pay:change', { 'driverType': 'solo', 'miles': '3000' });
      } else if (workType.val() == workTypeSolo && miles.value == miles3500) {
         let weeklyPay = '$1,880 to $2,325';
         let annualPay = '$95,880 to $118,575';
         updateCalcInfo(weeklyPay, annualPay);
         _logEvent('pay:change', { 'driverType': 'solo', 'miles': '3500' });
      } else if (workType.val() == workTypeTeam && miles.value == miles4500) {
         let weeklyPay = '$2,880 total | $1,440 per driver';
         let annualPay = '$146,880 total | $73,440 per driver';
         updateCalcInfo(weeklyPay, annualPay);
         _logEvent('pay:change', { 'driverType': 'team', 'miles': '4500' });
      } else if (workType.val() == workTypeTeam && miles.value == miles6000) {
         let weeklyPay = '$3,960 total | $1,980 per driver';
         let annualPay = '$201,960 total | $100,980 per driver';
         updateCalcInfo(weeklyPay, annualPay);
         _logEvent('pay:change', { 'driverType': 'team', 'miles': '6000' });
      } else if (workType.val() == workTypeTeam && miles.value == miles8000) {
         let weeklyPay = '$5,440 total | $2,720 per driver';
         let annualPay = '$277,440 total | $138,720 per driver';
         updateCalcInfo(weeklyPay, annualPay);
         _logEvent('pay:change', { 'driverType': 'team', 'miles': '8000' });
      }
   }

   function updateCalcInfo(weeklyPay, annualPay) {
      weeklyPayElem.text(weeklyPay);
      annualPayElem.text(annualPay);
   }
   function showSoloMiles() {
      if (miles.querySelector('option[value="4500"]')) {
         miles.querySelector('option[value="4500"]').remove();
         miles.querySelector('option[value="6000"]').remove();
         miles.querySelector('option[value="8000"]').remove();
         miles.insertAdjacentHTML('beforeend', '<option value="2500">2,500</option><option value="3000">3,000</option><option value="3500">3,500</option>');
         miles.value = 3000;
      }
   }

   function defaultSoloOptions() {
      miles.textContent = '';
      miles.insertAdjacentHTML('beforeend', '<option value="2500">2,500</option><option value="3000">3,000</option><option value="3500">3,500</option>');
      miles.value = 3000;
   }

   function showTeamMiles() {
      if (miles.querySelector('option[value="2500"]')) {
         miles.querySelector('option[value="2500"]').remove();
         miles.querySelector('option[value="3000"]').remove();
         miles.querySelector('option[value="3500"]').remove();
         miles.insertAdjacentHTML('beforeend', '<option value="4500">4,500</option><option value="6000">6,000</option><option value="8000">8,000</option>');
         miles.value = 6000;
      }
   }
});
