/**
 * Script to display 4Fund donation total using their Public API
 * API Documentation: https://4fund.com/api/v1/public/doc
 * Rate limit: 1000 requests per hour
 * Cache: 5 seconds
 */

(function() {
    const totalElement = document.getElementById('totaal-bedrag');
    
    if (!totalElement) return;
    
    async function load4FundTotal() {
        try {
            // 4Fund API has CORS blocking, so we use AllOrigins proxy
            const apiUrl = 'https://4fund.com/api/v1/public/whipRounds/yhwuw7';
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;
            
            const response = await fetch(proxyUrl);
            
            if (!response.ok) {
                throw new Error(`Proxy response: ${response.status}`);
            }
            
            const proxyData = await response.json();
            const data = JSON.parse(proxyData.contents);
            
            // Extract the collected amount from the API response
            // The API returns: { "collected": 12345, "goal": 50000, ... } in cents
            if (data.collected !== undefined) {
                // Convert cents to euros and format
                const euros = data.collected / 100;
                const formatted = euros.toLocaleString('nl-BE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
                totalElement.innerHTML = `€${formatted}`;
                totalElement.style.color = '#e67e22';
                totalElement.style.fontWeight = 'bold';
                totalElement.style.fontSize = '1.2em';
            } else {
                throw new Error('Collected amount not found in API response');
            }
        } catch (error) {
            console.error('Error fetching 4Fund total:', error);
            // Fallback to link
            totalElement.innerHTML = '<a href="https://4fund.com/nl/yhwuw7" target="_blank" rel="noopener noreferrer" style="color: #e67e22; text-decoration: underline; font-weight: 600;">Bekijk actuele stand →</a>';
        }
    }
    
    // Load on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', load4FundTotal);
    } else {
        load4FundTotal();
    }
})();
