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

class CustomerCartManagement implements CartService {
  protected isUserAuthenticated: boolean = false;

  constructor(userAuthenticated: boolean) {
    this.isUserAuthenticated = userAuthenticated;
  }
  public addItem(productId: string, quantity: number, productData?: AnonymousCartProduct): Promise<any> {
    if (this.isUserAuthenticated) {
      return fetch('/api/account/cart', {
        method: "POST",
        body: JSON.stringify({productId, quantity})
      })
    }

    if (!productData) {
      throw Error("productData must be set");
    }

    // add to store
    return useAnonymousCartStore((state) => state.addItem(productData, quantity));
  }

  public updateQuantity(productId: string, quantity: number): Promise<any> {
    if (this.isUserAuthenticated) {
      return fetch('/api/account/cart', {
        method: "PATCH",
        body: JSON.stringify({productId, quantity})
      })
    }
    return useAnonymousCartStore((state) => state.udpateQuantity(productId, quantity))
  }

  public removeItem(productId: string): Promise<any> {
    if (this.isUserAuthenticated) {
      return fetch(`/api/account/cart?=${productId}`, {
        method: 'DELETE'
      });
    }
    // remove from store
    return useAnonymousCartStore((state) => state.removeItem(productId));
  }

  public async getCart(): Promise<object[]> {
    if (this.isUserAuthenticated) {
      const response = await fetch('/api/account/cart', {
        method: "GET"
      });
      return await response.json();
    }
    // get stored cart products
    return useAnonymousCartStore((state) => state.items);
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