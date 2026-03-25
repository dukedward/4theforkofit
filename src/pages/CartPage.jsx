import React, { useState } from "react";
import { createOrder } from "../api/order";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/CartContext";
import CartItem from "@/components/cart/CartItem";
import { ShoppingCart, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

export default function CartPage() {
  const { items, total, clearCart } = useCart();
  const [step, setStep] = useState("cart"); // cart | details | success
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    notes: "",
    event_date: "",
  });
  const { toast } = useToast();

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const orderPayload = {
      ...form,
      items: items.map((i) => ({
        menu_item_id: i.menu_item_id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
      total,
    };

    console.log("ORDER PAYLOAD:", orderPayload);
    console.log("ORDER ITEMS:", orderPayload.items);

    await createOrder(orderPayload);
    clearCart();
    setStep("success");
    setSubmitting(false);
  };

  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-3">
            Order Placed!
          </h2>
          <p className="font-body text-muted-foreground mb-8">
            Thank you for your order! We'll reach out to confirm the details for
            your event.
          </p>
          <Link to="/">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-body">
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-secondary/30 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-body text-primary text-sm font-semibold uppercase tracking-[0.15em] mb-2">
            {step === "cart" ? "Review Your Items" : "Complete Your Order"}
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            {step === "cart" ? "Your Cart" : "Order Details"}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AnimatePresence mode="wait">
          {step === "cart" && (
            <motion.div
              key="cart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {items.length === 0 ? (
                <div className="text-center py-20">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    Your cart is empty
                  </h3>
                  <p className="font-body text-muted-foreground mb-6">
                    Browse our menu to add delicious items.
                  </p>
                  <Link to="/menu">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-body">
                      <ArrowLeft className="w-4 h-4 mr-2" /> View Menu
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="bg-card rounded-xl border border-border/50 p-6 mb-6">
                    {items.map((item) => (
                      <CartItem key={item.menu_item_id} item={item} />
                    ))}
                  </div>

                  <div className="bg-card rounded-xl border border-border/50 p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-body text-lg font-medium text-foreground">
                        Subtotal
                      </span>
                      <span className="font-display text-2xl font-bold text-primary">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                    <p className="font-body text-xs text-muted-foreground mb-4">
                      Final pricing may vary based on event size. We'll confirm
                      the total with you.
                    </p>
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-body font-semibold text-base py-6"
                      onClick={() => setStep("details")}
                    >
                      Proceed to Order Details
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {step === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button
                onClick={() => setStep("cart")}
                className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground mb-6"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Cart
              </button>

              <form
                onSubmit={handleSubmitOrder}
                className="bg-card rounded-xl border border-border/50 p-6 space-y-5"
              >
                <div className="space-y-2">
                  <Label className="font-body">Full Name *</Label>
                  <Input
                    required
                    value={form.customer_name}
                    onChange={(e) =>
                      setForm({ ...form, customer_name: e.target.value })
                    }
                    placeholder="Your name"
                    className="font-body"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-body">Email *</Label>
                  <Input
                    required
                    type="email"
                    value={form.customer_email}
                    onChange={(e) =>
                      setForm({ ...form, customer_email: e.target.value })
                    }
                    placeholder="you@email.com"
                    className="font-body"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-body">Phone</Label>
                  <Input
                    value={form.customer_phone}
                    onChange={(e) =>
                      setForm({ ...form, customer_phone: e.target.value })
                    }
                    placeholder="(555) 123-4567"
                    className="font-body"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-body">Event Date</Label>
                  <Input
                    type="date"
                    value={form.event_date}
                    onChange={(e) =>
                      setForm({ ...form, event_date: e.target.value })
                    }
                    className="font-body"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-body">Special Instructions</Label>
                  <Textarea
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                    placeholder="Allergies, serving preferences, etc."
                    className="font-body"
                  />
                </div>

                <div className="border-t border-border/50 pt-5">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-body font-medium">Order Total</span>
                    <span className="font-display text-xl font-bold text-primary">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm font-body text-muted-foreground mb-4 space-y-1">
                    {items.map((i) => (
                      <div
                        key={i.menu_item_id}
                        className="flex justify-between"
                      >
                        <span>
                          {i.name} x{i.quantity}
                        </span>
                        <span>${(i.price * i.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-body font-semibold text-base py-6"
                  >
                    {submitting ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : null}
                    {submitting ? "Placing Order..." : "Place Order"}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
