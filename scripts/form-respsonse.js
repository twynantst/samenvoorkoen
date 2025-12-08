function parseAantalFlessen(selection) {
  if (!selection || selection === "0") {
    return 0;
  }
  const regex = /(\d+)\s*(fles|flessen|dozen|doosje|doosjes)/;
  const match = selection.match(regex);
  if (match) {
    if (match[2].toLowerCase().includes("fles")) {
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
  var block = "";

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
  var total = 0;

  try {
    for (var i = 0; i < responses.length; i++) {
      var response = responses[i];
      var question = response.getItem().getTitle();
      if (question.includes("Aantal flessen")) {
        var price = bottlePrice(response);
        var count = bottleCount(response);
        if (count > 0 && price > 0) {
          table += `<tr>
                      <td style="border: 1px solid #ccc; padding: 8px;">${question}</td>
                      <td style="border: 1px solid #ccc; padding: 8px;">${count}</td>
                      <td style="border: 1px solid #ccc; padding: 8px;">€${price.toFixed(2)}</td>
                      <td style="border: 1px solid #ccc; padding: 8px;">€${(count * price).toFixed(2)}</td>
                    </tr>`;
          total = total + (count * price);
        }
      } else if (question.includes("Geschenkdozen")) {
        Logger.log("Geschenkdozen: " + response.getResponse());
        var count = parseInt(response.getResponse());
        var price = 3;
        if (count > 0 && price > 0) {
          table += `<tr>
                      <td style="border: 1px solid #ccc; padding: 8px;">Aantal geschenkdozen</td>
                      <td style="border: 1px solid #ccc; padding: 8px;">${count}</td>
                      <td style="border: 1px solid #ccc; padding: 8px;">€${price.toFixed(2)}</td>
                      <td style="border: 1px solid #ccc; padding: 8px;">€${(count * price).toFixed(2)}</td>
                    </tr>`;
          total = total + (count * price);
        }
      }

    }
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
    if (question.includes("opmerkingen")) {
      return "<p style=\"margin-bottom: 40px;text-decoration: underline;\">Uw opmerkingen:</p><p>" + response.getResponse() + "</p>";
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

    var htmlBody = `
      <!DOCTYPE html>
      <html>
        <head><meta charset="UTF-8"></head>
        <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color:#444;">Bedankt, ${naam(responses)} voor uw inzending!</h2>
          <p style="text-decoration: underline;">Uw bestelling:</p>
          ${totalOrder(responses)}
          <p>Gelieve het totaalbedrag over te maken op rekening:<br>
          <strong>BE20 7380 5241 2556</strong><br>
          Met vermelding: <strong>Wijn + uw ${email}</strong></p>
          <br>
          ${opmerkingen(responses)}
          <p style="margin-bottom: 20px; margin-top: 20px;">We nemen zo snel mogelijk contact met je op voor de verdere afhandeling.</p>
          <p style="margin-bottom: 20px;">
          Voorlopige afhaaldagen zijn gepland op:<br>
            <ul> 
              <li><strong>Zaterdag 20 december 2025 tussen 12 en 17:00 op Zijstraat 33, 2450 Meerhout</strong></li>
              <li><strong>Zaterdag 17 Januari 2026 tussen 12 en 17:00 op Houthoek 33, 2430 Vorst Laakdal</strong></li>
              <li><strong>Vrijdag 6 Februari 2026 's avonds op de Bodega ten voordelen van Koen op Denneoord, 2430 Eindhout Laakdal</strong></li>            
            </ul>
          </p>
          <p>Indien er vragen zijn, kan u steeds mailen naar <a href="mailto:wijn@samenvoorkoen.be">wijn@samenvoorkoen.be</a></p>
          <p style="margin-top: 40px;">
            Met vriendelijke groet,<br>
            <strong>SAMEN voor Koen TEGEN kanker</strong><br>
            Bedankt voor uw steun – samen maken we het verschil!
          </p>
        </body>
      </html>`;


    // Haal PDF van een publieke URL
    var pdfUrl = "https://samenvoorkoen.be/assets/wijn/bedankbrief.pdf";
    
    try {
      var response = UrlFetchApp.fetch(pdfUrl);
      pdfBlob = response.getBlob().setName("Wijnlijst.pdf");
    } catch (err) {
      Logger.log("ERROR fetching PDF: " + err.message);
    }

    // E-mail verzenden
    if (email) {
      var emailOptions = {
        to: email,
        name: "SAMEN voor Koen TEGEN kanker",
        subject: "Bevestiging van je bestelling - SAMEN voor Koen TEGEN kanker",
        htmlBody: htmlBody,
        body: "Bedankt voor uw bestelling! Gelieve het totaalbedrag over te maken op BE20 7380 5241 2556."
      };
      
      // Voeg attachment toe als het gelukt is
      if (pdfBlob) {
        emailOptions.attachments = [pdfBlob];
      }
      
      MailApp.sendEmail(emailOptions);
    }

    MailApp.sendEmail({
      to: "wijn.bestelling@samenvoorkoen.be",
      subject: `Bestelling wijn van ${naam(responses)} - ${email}`,
      htmlBody: htmlBody
    });

  } catch (err) {
    Logger.log("ERROR in onFormSubmit: " + err.message);
    Logger.log("Stack: " + err.stack);
    throw err;
  }
}
