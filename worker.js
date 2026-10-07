export default {
  fetch(request) {
    return new Response('This is a static site without a worker.', { status: 200 });
  }
};
