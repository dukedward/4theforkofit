import React from "react";
import { listOrders, updateOrder } from "../api/order";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  preparing: "bg-purple-100 text-purple-800 border-purple-200",
  ready: "bg-green-100 text-green-800 border-green-200",
  completed: "bg-gray-100 text-gray-800 border-gray-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

const STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];

export default function AdminOrders() {
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => listOrders("-created_date"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => updateOrder(id, { status }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] }),
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-secondary/30 py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/admin"
            className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Menu Management
          </Link>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Orders
          </h1>
          <p className="font-body text-muted-foreground mt-1">
            View and manage incoming orders.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <p className="font-body text-muted-foreground text-center py-10">
            Loading orders...
          </p>
        ) : orders.length === 0 ? (
          <p className="font-body text-muted-foreground text-center py-20">
            No orders yet.
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-card rounded-xl border border-border/50 p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {order.customer_name}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground">
                      {order.customer_email}{" "}
                      {order.customer_phone && `· ${order.customer_phone}`}
                    </p>
                    {order.event_date && (
                      <p className="font-body text-xs text-muted-foreground mt-1">
                        Event:{" "}
                        {format(new Date(order.event_date), "MMM d, yyyy")}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-xl font-bold text-primary">
                      ${order.total?.toFixed(2)}
                    </span>
                    <Select
                      value={order.status || "pending"}
                      onValueChange={(status) =>
                        updateMutation.mutate({ id: order.id, status })
                      }
                    >
                      <SelectTrigger className="w-36">
                        <Badge
                          className={`${STATUS_COLORS[order.status || "pending"]} border`}
                        >
                          {(order.status || "pending").charAt(0).toUpperCase() +
                            (order.status || "pending").slice(1)}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem
                            key={s}
                            value={s}
                            className="font-body capitalize"
                          >
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between font-body text-sm py-1"
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
                <p className="font-body text-xs text-muted-foreground mt-2">
                  Ordered:{" "}
                  {format(new Date(order.created_date), "MMM d, yyyy h:mm a")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
