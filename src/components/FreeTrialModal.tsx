import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  title: z.string().trim().min(1, "Title/Role is required").max(100),
  companyWebsite: z
    .string()
    .trim()
    .max(255)
    .refine(
      (val) => !val || /^https?:\/\/.+\..+/.test(val),
      "Please enter a valid URL (e.g. https://example.com)"
    )
    .optional()
    .or(z.literal("")),
  privacy: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the privacy policy" }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface FreeTrialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FreeTrialModal: React.FC<FreeTrialModalProps> = ({ open, onOpenChange }) => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      title: "",
      companyWebsite: "",
      privacy: undefined,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "notify-free-trial",
        {
          body: {
            name: values.name,
            email: values.email,
            title: values.title,
            companyWebsite: values.companyWebsite || null,
            source: document.referrer || "Direct",
          },
        }
      );

      if (fnError) throw new Error(fnError.message);
      if (data?.error) {
        setError(data.error);
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error("Free trial submission error:", err);
      setError("Something went wrong. Please try again or contact jason@galavanteer.com");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) {
      // Reset on close
      setTimeout(() => {
        setSubmitted(false);
        setError(null);
        form.reset();
      }, 300);
    }
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" style={{ background: "#FDFBF7" }}>
        {submitted ? (
          <div className="flex flex-col items-center text-center py-6 gap-4">
            <CheckCircle className="w-12 h-12" style={{ color: "#B8956C" }} />
            <DialogHeader>
              <DialogTitle className="font-display text-xl text-ink">
                You're in!
              </DialogTitle>
              <DialogDescription className="text-sm mt-2" style={{ color: "#5C554A", lineHeight: 1.7 }}>
                Check your email for confirmation. We'll have your Roundtable ready within 24–48 hours.
              </DialogDescription>
            </DialogHeader>
            <button
              onClick={() => handleOpenChange(false)}
              className="mt-4 px-6 py-2 text-xs font-medium tracking-wide uppercase bg-ink text-cream hover:bg-gold transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-xl text-ink">
                Start Your Free Trial
              </DialogTitle>
              <DialogDescription className="text-sm" style={{ color: "#5C554A" }}>
                10 days free. 60+ expert personas. No credit card required.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wide text-ink">
                        Full Name *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Smith" {...field} className="bg-white border-ink/10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wide text-ink">
                        Email *
                      </FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="jane@company.com" {...field} className="bg-white border-ink/10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wide text-ink">
                        Title / Role *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="VP of Strategy" {...field} className="bg-white border-ink/10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyWebsite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wide text-ink">
                        Company Website
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://company.com" {...field} className="bg-white border-ink/10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="privacy"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-xs" style={{ color: "#5C554A" }}>
                          I agree to the{" "}
                          <a
                            href="/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-ink"
                          >
                            Privacy Policy
                          </a>{" "}
                          *
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 w-full py-3 text-xs font-medium tracking-wide uppercase transition-all bg-ink text-cream hover:bg-gold disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Start Free Trial"
                  )}
                </button>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FreeTrialModal;
