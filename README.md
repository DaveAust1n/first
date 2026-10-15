# MetroDEVOPS AutoStore

A reusable React storefront template for Nigerian automotive-parts retailers.

## Stack
- React + Vite
- Tailwind CSS v4
- Lucide React
- WhatsApp enquiry links
- No backend or checkout in this version

## Run locally
```bash
npm install
npm run dev
```

## Build for production
```bash
npm run build
npm run preview
```

## Customize for a buyer
1. Edit `src/config/business.js` with the store's name, contact details, WhatsApp number, address, and currency.
2. Edit `src/data/products.js` to add the real product catalogue, prices, categories, image URLs, and availability.
3. Replace sample imagery with assets the business owns or has permission to use.
4. Test every WhatsApp enquiry link. The WhatsApp number must be international format with digits only, without a plus sign or spaces.
5. Review all prices and stock labels with the business before publishing.

## Notes
- Product details, prices, and availability in the starter catalogue are illustrative sample data, not live inventory.
- WhatsApp enquiries do not process payments or create orders automatically.
- Hosting, custom domain registration, online checkout, inventory management, and custom integrations are not included.
- Before selling a customized version, remove all demo content and ensure all images and assets are licensed for the intended use.
- Deploy to Vercel by importing the repository. Vite's default build command is `npm run build`, with output directory `dist`.

Built as a MetroDEVOPS digital product starter template.