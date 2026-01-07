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
      if (!answer.includes("Enkel afhaal")) {
        tijdslot = answer;
      }
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
      return `<p style="margin-top: 30px;"><strong>Uw opmerkingen:</strong></p><p style="margin-bottom: 30px; font-style: italic;">${response.getResponse()}</p>`;
    }
  }
  return "";
}

function tijdslot(bestelling) {
  if (!bestelling.tijdslot || bestelling.tijdslot.trim() === "") {
    return "";
  }

  return `<div style="background: white; padding: 20px; border-radius: 5px; border-left: 4px solid #e67e22; margin: 25px 0;">
    <h3 style="margin-top: 0; color: #2c3e50;">⏰ Gekozen tijdslot</h3>
    <p style="margin: 0; font-size: 18px; font-weight: bold; color: #2c3e50;">${bestelling.tijdslot}</p>
  </div>`;

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
    var bestelling = order(responses);

    var htmlBody = `
      <!DOCTYPE html>
      <html>
        <head><meta charset="UTF-8"></head>
        <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.8; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d4a5a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🍝 Eetfestijn & Afhaal</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #2c3e50; margin-top: 0;">Beste ${cname},</h2>
            
            <p>Bedankt voor uw bestelling voor onze eetdag! Hieronder vindt u het overzicht van uw bestelling.</p>
             
            ${tijdslot(bestelling)}
            
            <div style="background: white; padding: 20px; border-left: 4px solid #e67e22; margin: 25px 0; border-radius: 5px;">
              <h3 style="margin-top: 0; color: #2c3e50;">Uw bestelling:</h3>
              ${totalOrder(bestelling)}
            </div>
            
            <div style="background: #fff3e0; padding: 20px; border-radius: 5px; border-left: 4px solid #e67e22; margin: 25px 0;">
              <h3 style="margin-top: 0; color: #2c3e50;">Betaling</h3>
              <p style="margin: 8px 0;">Gelieve het totaalbedrag over te maken op rekening:</p>
              <p style="margin: 8px 0;"><strong>SAMEN voor Koen TEGEN kanker</strong></p>
              <p style="margin: 8px 0;"><strong>BE20 7380 5241 2556</strong></p>
              <p style="margin: 8px 0;">Met vermelding: <strong>Eten + ${cname}</strong></p>
            </div>
            
            <div style="text-align: center; margin: 25px 0;">
              <img src="https://samenvoorkoen.be/assets/payments/payconiq.png" alt="QR Code voor betaling" style="width:150px;height:150px; border-radius: 5px;">
              <br>
              <a href="HTTPS://PAYCONIQ.COM/T/1/3A27A9D64831C2A22202F34F" style="display: inline-block; padding: 12px 24px; background-color: #e67e22; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px 0; transition: background-color 0.3s;">Betaal via Payconiq</a>
            </div>
            
            ${opmerkingen(responses)}
            
            <p style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #e67e22; margin: 25px 0;">
              We nemen zo snel mogelijk contact met u op voor de verdere afhandeling.
            </p>
            
            <p style="margin-top: 30px;">Heeft u vragen? Mail ons gerust via <a href="mailto:eten@samenvoorkoen.be" style="color: #e67e22; text-decoration: none; font-weight: bold;">eten@samenvoorkoen.be</a></p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e0e0e0;">
              <p style="margin: 5px 0;">Met vriendelijke groet,</p>
              <p style="margin: 5px 0; font-weight: bold; color: #2c3e50;">Het team van SAMEN voor Koen TEGEN kanker</p>
              <p style="margin: 15px 0 5px 0; color: #666; font-style: italic;">Bedankt voor uw steun – samen maken we het verschil!</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding: 20px; background: white; border-radius: 5px;">
              <p style="margin: 0; color: #666; font-size: 14px;">Meer info op <a href="https://samenvoorkoen.be" style="color: #e67e22; text-decoration: none;">samenvoorkoen.be</a></p>
            </div>
          </div>
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
        subject: "Bevestiging bestelling Eetfestijn & Afhaal - SAMEN voor Koen TEGEN kanker",
        htmlBody: htmlBody,
        body: `Beste ${cname},

Bedankt voor uw bestelling voor onze eetdag!

Tijdstip: ${bestelling.tijdslot}

Gelieve het totaalbedrag over te maken op rekening:
SAMEN voor Koen TEGEN kanker
BE20 7380 5241 2556
Met vermelding: Eten + ${cname}

We nemen zo snel mogelijk contact met u op voor de verdere afhandeling.

Heeft u vragen? Mail ons via eten@samenvoorkoen.be

Met vriendelijke groet,
Het team van SAMEN voor Koen TEGEN kanker
Bedankt voor uw steun – samen maken we het verschil!

Meer info: https://samenvoorkoen.be`
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
