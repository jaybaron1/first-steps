CREATE TRIGGER auto_create_partner_client_from_lead_trg
AFTER INSERT ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.auto_create_partner_client_from_lead();