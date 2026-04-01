import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ShoppingBag } from "lucide-react";
import { listOrders } from "../api/order";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  preparing: "bg-purple-100 text-purple-800 border-purple-200",
  ready: "bg-green-100 text-green-800 border-green-200",
  completed: "bg-gray-100 text-gray-800 border-gray-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

export default function OrderHistory() {
  const { user, profile, isAuthenticated, isAdmin, loginWithGoogle, logout } =
    useAuth();
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["my-orders", user?.email],
    queryFn: () => listOrders({ customer_email: user.email }, "-created_date"),
    enabled: !!user?.email,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">
            Sign In Required
          </h2>
          <p className="font-body text-muted-foreground mb-6">
            Please sign in to view your order history.
          </p>
          <Button
            onClick={loginWithGoogle}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-body"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-secondary/30 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-body text-primary text-sm font-semibold uppercase tracking-[0.15em] mb-2">
            Your Account
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Order History
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isLoading ? (
          <p className="font-body text-muted-foreground text-center py-10">
            Loading your orders...
          </p>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No orders yet
            </h3>
            <p className="font-body text-muted-foreground mb-6">
              Place your first catering order today!
            </p>
            <Link to="/menu">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-body">
                Browse Menu
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-card rounded-xl border border-border/50 p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="font-body text-xs text-muted-foreground">
                      Placed:{" "}
                      {format(
                        new Date(order.created_date),
                        "MMM d, yyyy h:mm a",
                      )}
                    </p>
                    {order.event_date && (
                      <p className="font-body text-xs text-muted-foreground">
                        Event:{" "}
                        {format(new Date(order.event_date), "MMM d, yyyy")}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-xl font-bold text-primary">
                      ${order.total?.toFixed(2)}
                    </span>
                    <Badge
                      className={`${STATUS_COLORS[order.status || "pending"]} border capitalize`}
                    >
                      {order.status || "pending"}
                    </Badge>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between font-body text-sm"
                    >
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span className="text-muted-foreground">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                {order.notes && (
                  <p className="font-body text-sm text-muted-foreground mt-3 italic">
                    "{order.notes}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
