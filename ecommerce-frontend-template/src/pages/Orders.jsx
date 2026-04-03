import React, { useEffect } from "react";
import { Filter, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMyOrders } from "../store/slices/orderSlice";

const Orders = () => {
  const dispatch = useDispatch();
  const { myOrders, fetchingOrders } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Orders</h1>
            <p className="text-muted-foreground mt-2">
              View your past purchases.
            </p>
          </div>

          <Link
            to="/products"
            className="text-primary hover:underline font-semibold"
          >
            Shop more
          </Link>
        </div>

        <div className="mt-8 mb-4 text-muted-foreground flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <span className="font-semibold">
            {fetchingOrders ? "Loading..." : `${myOrders.length} orders`}
          </span>
        </div>

        {fetchingOrders ? (
          <div className="glass-panel text-muted-foreground p-6">
            Loading orders...
          </div>
        ) : myOrders.length === 0 ? (
          <div className="glass-panel text-muted-foreground p-6">
            No orders found. Complete a payment to see it here.
          </div>
        ) : (
          <div className="space-y-4">
            {myOrders.map((order) => {
              const paidDate = order?.paid_at
                ? new Date(order.paid_at).toLocaleString()
                : "";
              const isCancelled = order.order_status === "Cancelled";

              return (
                <div key={order.id} className="glass-panel p-6">
                  <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
                    <div>
                      <div className="font-semibold text-foreground">
                        Order: {order.id}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Placed:{" "}
                        {order.created_at
                          ? new Date(order.created_at).toLocaleString()
                          : ""}
                      </div>
                      {paidDate && (
                        <div className="text-sm text-muted-foreground mt-1">
                          Paid: {paidDate}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {isCancelled ? (
                        <XCircle className="w-5 h-5 text-destructive" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                      <div className="text-sm font-semibold text-foreground">
                        {order.order_status}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                      <div className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                        <Package className="w-4 h-4 text-primary" />
                        Items
                      </div>
                      <div className="space-y-3">
                        {order.order_items?.map((item) => (
                          <div
                            key={item.order_item_id}
                            className="flex gap-3 items-center glass-card p-3"
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-16 h-16 rounded-lg object-cover bg-secondary"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-foreground truncate">
                                {item.title}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Qty: {item.quantity} • ${Number(item.price || 0).toFixed(2)}
                              </div>
                            </div>
                            <div className="font-bold text-foreground">
                              ${(Number(item.price || 0) * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                        <Truck className="w-4 h-4 text-primary" />
                        Shipping
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="text-foreground font-semibold">
                          {order.shipping_info?.full_name}
                        </div>
                        <div>{order.shipping_info?.address}</div>
                        <div>
                          {order.shipping_info?.city}, {order.shipping_info?.state}{" "}
                          {order.shipping_info?.pincode}
                        </div>
                        <div>{order.shipping_info?.country}</div>
                        <div>Phone: {order.shipping_info?.phone}</div>
                      </div>

                      <div className="mt-4 border-t border-[hsla(var(--glass-border))] pt-3">
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                          <span>Total</span>
                          <span className="font-bold text-foreground">
                            ${Number(order.total_price || 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Tax</span>
                          <span>
                            ${Number(order.tax_price || 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Shipping</span>
                          <span>
                            ${Number(order.shipping_price || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
