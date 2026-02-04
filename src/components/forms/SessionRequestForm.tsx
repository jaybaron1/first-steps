import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Send } from "lucide-react";

import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const FormSchema = z.object({
  name: z.string().min(2, { message: "Please enter your full name" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  date: z.date({ required_error: "Pick a preferred date" }).optional(),
  goals: z.string().optional(),
});

const CALENDLY_URL = "https://calendly.com/jason-galavanteer/discovery_call";

const SessionRequestForm: React.FC = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { name: "", email: "", goals: "" },
  });

  function onSubmit(values: z.infer<typeof FormSchema>) {
    const when = values.date ? format(values.date, "PPP") : "(no date selected)";
    toast({
      title: "Thanks — let’s lock your 1:1",
      description: `We’ll open Calendly to finish booking. Preferred date: ${when}.`,
    });

    // Redirect to Calendly (simple redirect keeps it lightweight)
    const params = new URLSearchParams();
    params.set("name", values.name);
    params.set("email", values.email);
    window.location.href = `${CALENDLY_URL}?${params.toString()}`;
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-galavanteer-purple/10 shadow-sm">
      <h3 className="text-xl font-bold mb-2 text-galavanteer-gray">Request a 1:1 Session</h3>
      <p className="text-galavanteer-gray/80 mb-4">Pick a preferred date (optional) and tell me what you want from the session. You’ll confirm on Calendly.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" {...field} />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Preferred date (optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>We’ll try to accommodate this when scheduling.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="goals"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>What do you want from the session?</FormLabel>
                <FormControl>
                  <Textarea placeholder="e.g., capture my voice, map SOPs, plan content cadence…" rows={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" className="hover-scale inline-flex items-center gap-2">
              Book on Calendly <Send size={16} />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SessionRequestForm;
