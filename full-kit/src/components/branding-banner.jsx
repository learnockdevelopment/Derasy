import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function BrandingBanner({
  user,
  content = "هذه هي المدارس التي تمتلكها.",
  pageTitle,
  actionButton, // Can be a JSX button or any element
}) {
  return (
    <>
      {/* Full-Width Banner */}
      <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden border-y border-gray-200 py-10 text-center shadow-sm mt-25 mb-8">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundColor: "#DFDBE5",
            backgroundImage: `url("data:image/svg+xml,...")`,
            backgroundRepeat: "repeat",
          }}
        />
        {/* Blur Overlay */}
        <div className="absolute inset-0 backdrop-blur-xs z-10" />

        {/* Text Content */}
        <div className="relative z-20 px-4 max-w-5xl mx-auto">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            نحن منصّة دراسي – نُعلّم، نُرشد، ونفتح أبواب المستقبل.
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            من خلال منصتنا، يمكن للطلاب طلب كارنيهاتهم إلكترونيًا، ويقوم مدير المدرسة بمراجعتها والموافقة عليها بضغطة زر.
          </p>
        </div>
      </div>

      {/* User Welcome Section */}
      {user && (
        <div className="text-start mt-8">
          <div className="flex items-center justify-start gap-3 mb-4 mx-auto">
            <Avatar className="w-[100px] h-[100px] rounded-full overflow-hidden border-2 border-purple-700">
              <AvatarImage src={user?.avatar || ""} alt={user?.fullName || "User"} />
              <AvatarFallback>{user?.fullName?.charAt(0) || "?"}</AvatarFallback>
            </Avatar>
            <div className="text-start">
              <h1 className="text-2xl font-bold text-purple-700">
                مرحبًا بعودتك، {user?.fullName} 👋
              </h1>
              <p className="text-muted-foreground text-sm">{content}</p>
            </div>
          </div>
        </div>
      )}

      {/* Optional Page Title + Action Button */}
      {(pageTitle || actionButton) && (
        <div className="flex items-center justify-between mt-6 mb-4 px-2 md:px-0">
          {pageTitle && (
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
              {pageTitle}
            </h2>
          )}
          {actionButton && <div>{actionButton}</div>}
        </div>
      )}
    </>
  );
}
