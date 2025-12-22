/**
 * Google Forms Response Handler
 * 
 * Required OAuth Scopes (will be auto-detected):
 * - Forms: Read form responses
 * - Mail: Send emails
 * - URL Fetch: Download PDF attachments
 */

const PRIJZEN = {
  spaghetti: 15,
  vspaghetti: 15,
  stoofvlees: 20,
  videe: 20,
  kinder: 10
};

function order(responses) {
  var tijdslot = "";
  var spaghetti = 0;
  var vspaghetti  = 0;
  var stoofvlees = 0;
  var videe = 0;
  var kinder = 0;

  for (var i = 0; i < responses.length; i++) {
    var response = responses[i];
    var question = response.getItem().getTitle();
    var answer = response.getResponse();  
    if (question.includes("tijdslot")) {
      tijdslot = answer;
    } else if (question.includes("Vegetarische")) {
      vspaghetti = parseInt(answer) || 0;
    } else if (question.includes("Spaghetti")) {
      spaghetti = parseInt(answer) || 0;
    } else if (question.includes("Stoofvlees")) {
      stoofvlees = parseInt(answer) || 0;
    } else if (question.includes("Videe")) {
      videe = parseInt(answer) || 0;
    } else if (question.includes("Kinderportie")) {
      kinder = parseInt(answer) || 0;
    }  
  }
  return {
    tijdslot: tijdslot,
    spaghetti: spaghetti,
    vspaghetti: vspaghetti,
    stoofvlees: stoofvlees,
    videe: videe,
    kinder: kinder
  };
}

function entry(name, count, price) {
  if (count <= 0) { 
    return "";
  }

  return `<tr>
            <td style="border: 1px solid #ccc; padding: 8px;">${name}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">${count}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">€${price.toFixed(2)}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">€${(count * price).toFixed(2)}</td>
          </tr>`;
}


function totalOrder(order) {
  var table = `
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
        <thead>
          <tr>
            <th style="border: 1px solid #ccc; padding: 8px; background-color: #f4f4f4;">Naam</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Aantal</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Prijs</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Totaal</th>
          </tr>
        </thead>
        <tbody>`;

  try {
   
    table += entry("Spaghetti", order.spaghetti, PRIJZEN.spaghetti);
    table += entry("Vegetarische Spaghetti", order.vspaghetti, PRIJZEN.vspaghetti);
    table += entry("Stoofvlees friet", order.stoofvlees, PRIJZEN.stoofvlees);
    table += entry("Videe friet", order.videe, PRIJZEN.videe);
    table += entry("Kinderportie frietjes met vlees", order.kinder, PRIJZEN.kinder);
    
    var total = (order.spaghetti * PRIJZEN.spaghetti) + (order.vspaghetti * PRIJZEN.vspaghetti) + (order.stoofvlees * PRIJZEN.stoofvlees) + (order.videe * PRIJZEN.videe) + (order.kinder * PRIJZEN.kinder);
    table += `
            <tr>
              <td colspan="3" style="border: 1px solid #ccc; padding: 8px; text-align: right;"><strong>Totaal:</strong></td>
              <td style="border: 1px solid #ccc; padding: 8px;"><strong>€${total.toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>`
    return table;
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
    var answer = response.getResponse();
    if (question.includes("Opmerkingen") && answer && answer.trim() !== "") {
      return `<p style="margin-top: 40px;text-decoration: underline;">Uw opmerkingen:</p><p style="margin-bottom: 40px">${response.getResponse()}</p>`;
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

    var cname = naam(responses);

    var htmlBody = `
      <!DOCTYPE html>
      <html>
        <head><meta charset="UTF-8"></head>
        <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color:#444;">Bedankt, ${cname} voor uw inzending!</h2>
          <p style="text-decoration: underline;">Uw bestelling:</p>
          ${totalOrder(order(responses))}
          <p>Gelieve het totaalbedrag over te maken op rekening:<br>
          <strong>SAMEN voor Koen TEGEN kanker</strong><br>
          <strong>BE20 7380 5241 2556</strong><br>
          Met vermelding: <strong>Eten + ${cname}</strong></p>
          <img src="https://samenvoorkoen.be/assets/payments/payconiq.png" alt="QR Code voor betaling" style="width:150px;height:150px;">
          <br>
          <a href="HTTPS://PAYCONIQ.COM/T/1/3A27A9D64831C2A22202F34F" style="display: inline-block; padding: 12px 24px; background-color: #FF4785; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px 0;">💳 Betaal via Payconiq</a>
          ${opmerkingen(responses)}
          <p style="margin-bottom: 20px; margin-top: 20px;">We nemen zo snel mogelijk contact met je op voor de verdere afhandeling.</p>
          <p>Indien er vragen zijn, kan u steeds mailen naar <a href="mailto:eten@samenvoorkoen.be">eten@samenvoorkoen.be</a></p>
          <p style="margin-top: 40px;">
            Met vriendelijke groet,<br>
            <strong>SAMEN voor Koen TEGEN kanker</strong><br>
            Bedankt voor uw steun – samen maken we het verschil!
          </p>
        </body>
      </html>`;


    // Haal PDF van een publieke URL
    var pdfUrl ="https://twynantst.github.io/samenvoorkoen/assets/wijn/bedankbrief.pdf"
    var pdfBlob = null;

    try {
      var response = UrlFetchApp.fetch(pdfUrl);
      pdfBlob = response.getBlob().setName("bedankbrief.pdf");
    } catch (err) {
      Logger.log("ERROR fetching PDF: " + err.message);
    }

    // E-mail verzenden
    if (email) {
      var emailOptions = {
        to: email,
        cc: "eten.bestelling@samenvoorkoen.be",
        name: "SAMEN voor Koen TEGEN kanker",
        subject: "Bevestiging van je bestelling voor de eetdag - SAMEN voor Koen TEGEN kanker",
        htmlBody: htmlBody,
        body: "Bedankt voor uw bestelling! Gelieve het totaalbedrag over te maken op BE20 7380 5241 2556."
      };
      
      // Voeg attachment toe als het gelukt is
      if (pdfBlob) {
        emailOptions.attachments = [pdfBlob];
      }
      
      MailApp.sendEmail(emailOptions);
    }
  } catch (err) {
    Logger.log("ERROR in onFormSubmit: " + err.message);
    Logger.log("Stack: " + err.stack);
    throw err;
  }
}
