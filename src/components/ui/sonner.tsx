
import React from "react"
import { Toaster as Sonner, toast } from "sonner"
import { useTheme } from "@/components/theme-provider"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      richColors
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-[#7d8768]/20 group-[.toaster]:shadow-xl group-[.toaster]:rounded-xl group-[.toaster]:backdrop-blur-sm",
          description: "group-[.toast]:text-gray-600 group-[.toast]:font-audrey",
          title: "group-[.toast]:font-gilda-display group-[.toast]:font-semibold",
          actionButton:
            "group-[.toast]:bg-gradient-to-r group-[.toast]:from-[#7d8768] group-[.toast]:to-[#9d627b] group-[.toast]:text-white group-[.toast]:hover:from-[#7a7539] group-[.toast]:hover:to-[#9d627b] group-[.toast]:rounded-lg group-[.toast]:font-semibold",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-700 group-[.toast]:hover:bg-gray-200",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
