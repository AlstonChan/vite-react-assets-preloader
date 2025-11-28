# Vite ReactJs Assets Preloader

This demo shows if it can preload all the assets (images in this case) before showing the asset to the user.

> [!NOTE]
> All the images shown has a querystring of `?cache-bust={UUID}` to ensure that the images aren't cached so that a refresh of the page can preview the page again without browser caching to disrupt the result.

The preload page shows that it is possible to actively load all the images, and also paint the images to the DOM synchronously to ensure that when the loading screen is taken away, the user can immediately see the images without any flickering.

## Getting Started

1. Clone the repository to your local machine

   ```bash
   git clone https://github.com/AlstonChan/vite-react-assets-preloader.git
   ```

2. Change directory to the project and install dependencies

   ```bash
   npm i
   ```

3. Run the development server

   ```bash
   npm run dev
   ```

   The site should be available at <http://localhost:5173>

## Resources

- [HTMLImageElement: `decode()` method](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode) - decode the image so it can be rendered immediately after it has been painted to the DOM. Image being loaded from network does not means that painting it to DOM is instant.
- [HTMLImageElement: `decoding` property](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decoding)

## License

[Apache 2.0](./LICENSE)
