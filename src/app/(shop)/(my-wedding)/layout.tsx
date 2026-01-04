import AsideSidebarCart from '@/components/aside-sidebar-cart'
import AsideSidebarNavigation from '@/components/aside-sidebar-navigation'
import AsideSidebarCategories from '@/components/aside-sidebar-categories'
import Footer from '@/components/footer'
import Header from '@/components/header/header'

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* HEADER */}
      <Header variant="bg-transparent-text-white" hasBottomBorder={false} />

      {/* MAIN CONTENT */}
      {children}

      {/* FOOTER */}
      <Footer className="container mt-16 sm:mt-20" />

      {/* ASIDES */}
      <AsideSidebarNavigation />
      <AsideSidebarCategories />
      <AsideSidebarCart />
    </div>
  )
}

