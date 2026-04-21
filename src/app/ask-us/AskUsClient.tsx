"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

export function AskUsClient() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-primary italic">Ask Us</h1>
            <p className="text-lg text-muted-foreground">For any requirement or help from the community, please fill this form.</p>
          </div>

          <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 sm:p-12">
            <CardHeader className="text-center space-y-4">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto text-primary">
                <MessageCircle className="w-10 h-10" />
              </div>
              <CardTitle className="text-2xl font-black">Submit Enquiry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <p className="text-muted-foreground">
                We're here to help you navigate the ecosystem. Click the button below to submit your Enquiry via our form.
              </p>
              <Link href="https://form.svhrt.com/69de46f81fdb9c954fb903dd" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="mt-6 w-full rounded-full h-16 font-black text-lg bg-primary hover:bg-accent/90 group">
                  Submit Now
                  <ExternalLink className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </Link>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
