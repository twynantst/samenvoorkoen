function parseAantalFlessen(selection) {
  if (!selection || selection === "0") {
    return 0;
  }
  const regex = /(\d+)\s*(fles|flessen|dozen|doosje|doosjes)/;
  const match = selection.match(regex);
  if (match) {
    if(match[2].toLowerCase().includes("fles")){
      return parseInt(match[1]);  
    } else {
      return parseInt(match[1]) * 6;
    }
  }
  throw new Error("Unknown number of bottles");
}

function bottleCount(response) {
  var question = response.getItem().getTitle();
  var antwoord = response.getResponse();
  var count = 0
  if (question.includes("Aantal flessen") && Array.isArray(antwoord)) {
      for (var i = 0; i < antwoord.length; i++) {
         count = count + parseAantalFlessen(antwoord[i])
      }
  }
  return count; 
}

function bottlePrice(response) {
  var question = response.getItem().getTitle();
    
  if (question.includes("Or du Sud")) {
    return 10;
  }
  else if (question.includes("Gran Sasso")) {
    return 10;
  }
  else if (question.includes("Vega Vella")) {
    return 15;  
  }
  else if (question.includes("La Guarida")) {
    return 15;  
  }
  else if (question.includes("Pere Ventura")) {
    return 15;  
  }
  return 0; 
}

function fallback(responses) {
  var block = "<p><strong>Uw bestelling:</strong></p>";
  
  for (var i = 0; i < responses.length; i++) {
    var response = responses[i];
    var question = response.getItem().getTitle();
    if (question.includes("Aantal flessen")) {
        block = block + "<p>" + question + ": " + response.getResponse().join(", ") + "</p>";
    }
  }
  return block;
}


function totalOrder(responses) {
  var block = "<p><strong>Uw bestelling:</strong></p><table border=\"1\">" + 
  "<tr><th>Naam</th><th>Aantal</th><th>Prijs</th><th>Totaal</th></tr>";
  var total = 0;

  try {
    for (var i = 0; i < responses.length; i++) {
        var respons = responses[i];
        var question = respons.getItem().getTitle();
        var price = bottlePrice(respons);
        var count = bottleCount(respons);
        if (count > 0 && price > 0) {
            block = block + "<tr><td>" + question + "</td><td>" + count + "</td><td>€" + price + ",00</td><td>€" + (count * price) + ",00</td></tr>";
            total = total + (count * price);
        }
      }
      block = block + "</table><p><strong>Totaal: €" + total + ",00</strong></p>";
      return block;
  }
  catch (err) {
    Logger.log("Error in totalOrder: " + err.message);
    Logger.log("Stack: " + err.stack);
    return fallback(responses);
  }
}

function naam(responses) {
  for (var i = 0; i < responses.length; i++) {
    var response = responses[i];
    var question = response.getItem().getTitle();
    if (question.includes("achternaam")) {
        return response.getResponse();
    }
  }
  return "onbekend";
}

function opmerkingen(responses) {
  for (var i = 0; i < responses.length; i++) {
    var response = responses[i];
    var question = response.getItem().getTitle();
    if (question.includes("opmerkingen")) {
        return "<p style=\"margin-bottom: 40px;\"><strong>Uw opmerkingen:</strong></p><p>" + response.getResponse() + "</p>";
    }
  }
  return "";
}


function onFormSubmit(e) {
  try {
    var responses = e.response.getItemResponses();
    var email = e.response.getRespondentEmail();

    if (!email) {
        Logger.log("ERROR: No email address found");
        return;
    }

    var message = "<h2>Bedankt voor je inzending \"" + naam(responses) + "\"!</h2>" + totalOrder(responses) + 
        "<p style=\"margin-bottom: 20px;\">Gelieve het totaalbedrag over te maken op rekening: <strong>BE20 7380 5241 2556 </strong><br>Met vermelding: <strong>Wijn + " + email + "</strong></p>" + 
        opmerkingen(responses) + 
        "<p style=\"margin-bottom: 20px;\">We nemen zo snel mogelijk contact met je op voor de verdere afhandeling.</p>" +
        "<p style=\"margin-bottom: 40px;\">Alle opbrengsten gaan naar Koens PIPAC-behandeling. 🍷💙</p>" +
        "<p style=\"margin-bottom: 20px;\">Indien er vragen zijn, kan u steeds mailen naar wijn@samenvoorkoen.be</p>" + 
        "<p style=\"margin-bottom: 20px;\">Met vriendelijke groet, <br> SAMEN voor Koen TEGEN kanker <br> Bedankt voor uw steun – samen maken we het verschil!</p>";

    // E-mail verzenden
    if (email) {
        MailApp.sendEmail({
            to: email,
            subject: "Bevestiging van je inzending 'SAMEN voor Koen TEGEN kanker'",
            htmlBody: message
        });
    }
    if (email) {
        MailApp.sendEmail({
            to: "wijn.bestelling@samenvoorkoen.be",
            subject: "Bestelling wijn van " + naam(responses),
            htmlBody: message
        });
    }
  } catch (err) {
    Logger.log("ERROR in onFormSubmit: " + err.message);
    Logger.log("Stack: " + err.stack);
    throw err;
  }
}
