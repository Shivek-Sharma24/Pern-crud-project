import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

//base url will be dynamic depending on the environment.
const base_url = import.meta.env.MODE === "development" ? "http://localhost:5200":""

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  currentProduct: null,
  isChange : false,
  isLoading : false ,
  // form data state;
  formData: {
    name: "",
    price: "",
    image: "",
  },
  setFormData: (formdata) => set({ formData: formdata }),
  resetData: () =>
    set({
      formData: {
        name: "",
        price: "",
        image: "",
      },
    }),
  addProduct: async (e) => {
    e.preventDefault();
    set({ loading: true });
    try {
      const { formData } = get();
      await axios.post(`${base_url}/api/products/create`, formData);
      set({ isChange:true })
      await get().fetchProducts();
      await get().resetData();
      toast.success("Product added successfully.");
      //  todo: close the model
      document.getElementById("add_product_modal").close();
    } catch (error) {
      toast.error("Something went wrong.");
      console.log("Error while adding product :-", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchProducts: async () => {
   if(get().products.length > 0 && !get().isChange) return; // to prevent multiple api calls;

    set({ loading: true });
    try {
      const res = await axios.get(`${base_url}/api/products`);
      set({ products: res.data.data, isChange: false });

    } catch (err) {
      if (err.status == 429)
        set({
          error: "Too many requests. Please try again later.",
          products: [],
        });
      else set({ error: "something went wrong", products: [] });
    } finally {
      set({ loading: false });
    }
  },
  // delete Product api;
  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`${base_url}/api/products/${id}`);
      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
      }));
      toast.success("Product deleted successfully.");
      set({ isChange:true })
    } catch (error) {
      toast.error("Something went wrong.");
      // set({error:"Failed to delete product"})
      console.log("Error while delete Product :-", error);
    } finally {
      set({ loading: false });
    }
  },

  // Product edit functionality
  fetchProduct: async (id) => {
  
    set({ loading: true });
    try {
      const res = await axios.get(`${base_url}/api/products/${id}`);
      set({ currentProduct: res.data.data, 
        formData: res.data.data ,//prefill form data with current product data;
        error: null
    });
    } catch (error) {
      toast.error("Something went wrong.");
      console.log("Errror in fetching product", error);
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id) => {
    set({ isLoading: true });
    try {
        const {formData} = get();
       const res =  await axios.put(`${base_url}/api/products/${id}`, formData);
        set({currentProduct:res.data.data});
        // await get().fetchProducts();
        toast.success("Product updated successfully.");
        set({isChange:true}) // to indicate that products list has changed;
    } catch (error) {
        toast.error("Failed to update product.");
        console.log("Error while updating product:", error);    
    }finally{
        set({isLoading:false})
    }
  },
}));
