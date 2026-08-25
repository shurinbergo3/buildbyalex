/**
 * Where the contact form parks the visitor's name for the thank-you page.
 *
 * sessionStorage rather than a query param: Metrika and GA4 both report the
 * full page URL, so a name in the query string ends up in two analytics
 * accounts, the server logs and the Referer header of the next outbound click.
 */
export const LEAD_NAME_KEY = "bba_lead_name";
