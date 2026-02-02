import React from 'react'
import { useProductStore } from '../store/useProductStore'
import { useEffect} from 'react'
import { PackageIcon, PlusCircle, RefreshCwIcon } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import AddProductModel from '../components/AddProductModel'

const HomePage = () => {
  const {products ,fetchProducts , loading , error , isChange} = useProductStore();
      

  useEffect(()=>{
    fetchProducts()
  },[])
  return (
   <main className='px-4 py-8 mx-auto max-w-6xl'>
    <div className="flex justify-between items-center mb-8">
     <button className='btn btn-primary rounded-md' onClick={()=> document.getElementById("add_product_modal").showModal()}>
  <PlusCircle className='size-5 mr-2'/>
  Add Product
     </button>
     {/* <button className='btn btn-ghost btn-circle' onClick={fetchProducts}>
      <RefreshCwIcon className='size-5'/>
     </button> */}
    </div>

{/* Adding Product model */}
<AddProductModel/>

    {/* Main UI */}
    {error && <div className='alert alert-error mb-8'>{error}</div>}

    {products.length === 0 && !loading && (
      <div className="flex flex-col justify-center items-center h-96 space-y-4">
<div className="bg-base-100 p-6 rounded-full">
<PackageIcon className='size-12'/>
</div>
<div className="text-center space-y-2">
<h3 className='text-2xl font-semibold'>No Products Found</h3>
<p className='text-gray-500 max-w-sm'>
  Get Started by your adding first product to the inventory.
</p>
</div>
      </div>
    )}


    {loading ? (
      <div className="flex justify-center h-64 items-center">
  <div className="loading loading-spinner loading-lg"></div>
      </div>
    ):(
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
       {products.map((product)=>(
        <ProductCard key={product.id} product={product}/>
       ))}
      </div>
    )}
   </main>
  )
}

export default React.memo(HomePage)
