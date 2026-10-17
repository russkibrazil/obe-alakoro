import { AnonymousCartProduct, useAnonymousCartStore } from "@/store/cartStore";

interface CartService {
  addItem(
    productId: string,
    quantity: number
  ): Promise<any>;

  updateQuantity(
    productId: string,
    quantity: number
  ): Promise<any>;

  removeItem(productId: string): Promise<any>;

  getCart(): Promise<object[]>;
  // persistCart(): Promise<any>;
}

export class CustomerCartManagement implements CartService {
  protected isUserAuthenticated: boolean = false;

  constructor(userAuthenticated: boolean) {
    this.isUserAuthenticated = userAuthenticated;
  }
  public addItem(productId: string, quantity: number, productData?: AnonymousCartProduct): Promise<any> {
    if (this.isUserAuthenticated) {
      return fetch('/api/account/cart', {
        method: "POST",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({productId, quantity})
      })
    }

    if (!productData) {
      throw Error("productData must be set");
    }

    // add to store
    return useAnonymousCartStore.getState().addItem(productData, quantity);
  }

  public updateQuantity(productId: string, quantity: number): Promise<any> {
    if (this.isUserAuthenticated) {
      return fetch('/api/account/cart', {
        method: "PATCH",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({productId, quantity})
      })
    }
    return useAnonymousCartStore.getState().updateQuantity(productId, quantity);
  }

  public removeItem(productId: string): Promise<any> {
    if (this.isUserAuthenticated) {
      return fetch(`/api/account/cart?=${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
    }
    // remove from store
    return useAnonymousCartStore.getState().removeItem(productId);
  }

  public clearCart(): Promise<any> {
    if (this.isUserAuthenticated) {
      return fetch(`/api/account/cart`, {
          method: 'DELETE',
          credentials: 'include',
        });
    }
    return useAnonymousCartStore.getState().clearCart();
  }

  public async getCart(): Promise<object[]> {
    if (this.isUserAuthenticated) {
      const response = await fetch('/api/account/cart', {
        method: "GET",
        credentials: 'include'
      });
      return await response.json();
    }
    // get stored cart products
    return useAnonymousCartStore.getState().items;
  }

  protected async persistCart(): Promise<any> {
    if (this.isUserAuthenticated) {
      return ;
    }
    const cart = await this.getCart();
    return syncAnonymousCart(cart.map(item => {
      return {
        productId: item.productId,
        quantity: item.quantity
      }
    }));
  }

  public setIsUserAutenticated(newState: boolean) {
    const oldState = this.isUserAuthenticated;
    this.isUserAuthenticated = newState;
    if (!oldState && newState) {
      this.persistCart();
      useAnonymousCartStore.getState().clearCart();
    }
  }
}

interface SyncCartItem {
  productId: string;
  quantity: number;
}

export async function syncAnonymousCart(
  items: SyncCartItem[]
): Promise<void> {
  if (items.length === 0) {
    return;
  }

  await fetch('/api/account/cart/sync', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ items }),
  });
}