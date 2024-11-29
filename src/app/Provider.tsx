import Navbar from "@/components/Navbar"

type Props = {
  children: React.ReactNode
}

const Provider: React.FC<Props> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className='mt-28'>
        {children}
      </div>
    </div>
  )
}

export default Provider
