import { Card } from "@/components/ui/card"
import { type RestaurantData, statusColorMap } from "@/types/restaurant"

interface RestaurantCardProps {
  data: RestaurantData
}

const dayNames: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday'
}

export function RestaurantCard({ data }: RestaurantCardProps) {
  return (
    <Card className="restaurant-info-card w-full max-w-sm p-8 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-700 border border-white/10 backdrop-blur-sm shadow-2xl">
      {/* Logo Section */}
      <div className="text-center mb-6">
        <img
          src="/images/image_001.webp"
          alt="Qitchen Restaurant Logo"
          className="h-8 w-auto mx-auto filter brightness-120"
        />
      </div>

      {/* Working Hours */}
      <div className="mb-6">
        <h3 className="font-serif text-lg font-normal text-amber-100 mb-4 text-center tracking-wider uppercase">
          Working Hours
        </h3>
        <div className="space-y-2">
          {Object.entries(data.workingHours || {}).map(([day, hours]) => (
            <div
              key={day}
              className="flex justify-between items-center p-2 rounded-lg bg-white/5 border border-amber-100/10"
            >
              <span className="font-medium text-sm text-white/95">
                {dayNames[day]}
              </span>
              <div className="flex items-center gap-2">
                {hours.isOpen ? (
                  <span className="font-mono text-xs text-amber-100 font-semibold">
                    {hours.open} — {hours.close}
                  </span>
                ) : (
                  <span className="font-mono text-xs text-gray-400 font-semibold">
                    Закрыто
                  </span>
                )}
                <span
                  className="w-1.5 h-1.5 rounded-full opacity-80"
                  style={{ backgroundColor: statusColorMap[hours.status] }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Media */}
      <div className="mt-auto">
        <h3 className="font-serif text-base font-normal text-amber-100 mb-4 text-center tracking-wider uppercase">
          Follow Us
        </h3>
        <div className="flex justify-center gap-3">
          <a
            href="https://www.instagram.com/qitchen.restaurant/"
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center justify-center w-8 h-8 border border-amber-100/30 rounded-full bg-transparent transition-all duration-300 hover:border-amber-100/70 hover:bg-amber-100/10 hover:-translate-y-0.5"
          >
            <svg viewBox="0 0 256 256" className="w-3.5 h-3.5 fill-amber-100">
              <path d="M128,82a46,46,0,1,0,46,46A46.06,46.06,0,0,0,128,82Zm0,80a34,34,0,1,1,34-34A34,34,0,0,1,128,162ZM176,26H80A54.06,54.06,0,0,0,26,80v96a54.06,54.06,0,0,0,54,54h96a54.06,54.06,0,0,0,54-54V80A54.06,54.06,0,0,0,176,26Zm42,150a42,42,0,0,1-42,42H80a42,42,0,0,1-42-42V80A42,42,0,0,1,80,38h96a42,42,0,0,1,42,42ZM190,76a10,10,0,1,1-10-10A10,10,0,0,1,190,76Z"/>
            </svg>
          </a>
          <a
            href="https://www.facebook.com/qitchen.restaurant/"
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center justify-center w-8 h-8 border border-amber-100/30 rounded-full bg-transparent transition-all duration-300 hover:border-amber-100/70 hover:bg-amber-100/10 hover:-translate-y-0.5"
          >
            <svg viewBox="0 0 256 256" className="w-3.5 h-3.5 fill-amber-100">
              <path d="M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26Zm6,191.8V150h26a6,6,0,0,0,0-12H134V112a18,18,0,0,1,18-18h16a6,6,0,0,0,0-12H152a30,30,0,0,0-30,30v26H96a6,6,0,0,0,0,12h26v67.8a90,90,0,1,1,12,0Z"/>
            </svg>
          </a>
          <a
            href="https://twitter.com/qitchen"
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center justify-center w-8 h-8 border border-amber-100/30 rounded-full bg-transparent transition-all duration-300 hover:border-amber-100/70 hover:bg-amber-100/10 hover:-translate-y-0.5"
          >
            <svg viewBox="0 0 256 256" className="w-3.5 h-3.5 fill-amber-100">
              <path d="M245.54,69.71A6,6,0,0,0,240,66H208.4a46.6,46.6,0,0,0-40.33-24,44.93,44.93,0,0,0-32.31,13.12A45.92,45.92,0,0,0,122,88v8.66c-42-10-76.6-44.52-77-44.88A6,6,0,0,0,34.8,55.46c-4.25,47.22,9.42,78.75,21.64,96.89a107.71,107.71,0,0,0,23.07,25c-15.49,19-41.34,28.89-41.62,29a6,6,0,0,0-2.88,9C36,216.83,45.78,230,80,230c69.88,0,128.23-54,133.82-123.34l30.42-30.41A6,6,0,0,0,245.54,69.71ZM203.76,99.76a6,6,0,0,0-1.75,3.86C197.93,167.76,144.33,218,80,218c-14,0-22.76-2.41-28.06-4.8,11.3-5.68,29.72-16.88,41.05-33.87a6,6,0,0,0,.85-4.67A6,6,0,0,0,91,170.82c-.13-.08-13.13-7.86-25-25.72C52,124,45.31,98.43,46,68.88c14.88,12.6,45.57,35.09,81,41a6,6,0,0,0,7-5.92V88a34,34,0,0,1,10.19-24.34A33.05,33.05,0,0,1,167.93,54c13.43.17,26,8.37,31.24,20.4a6,6,0,0,0,5.5,3.6h20.84Z"/>
            </svg>
          </a>
        </div>
      </div>
    </Card>
  )
}
