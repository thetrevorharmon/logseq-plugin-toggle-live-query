import "@logseq/libs";

const listeners: { element: Element; listener: (event: Event) => void }[] = [];

async function main() {
  logseq.provideStyle({
    style: `
      .ls-block .custom-query>.th {
        opacity: 0.3;
        transition: opacity 0.2s;
        cursor: pointer;
      }

      .ls-block .custom-query>.th:hover {
        opacity: 1;
      }

      .custom-query .cp__query-builder {
        display: none;
      }

      .custom-query.active .cp__query-builder {
        display: block;
      }
    `,
  });

  function resetListeners() {
    const appContainer = parent.document.getElementById("app-container");

    if (appContainer == null) {
      return;
    }

    listeners.forEach(({ element, listener }) => {
      (element as HTMLElement).removeEventListener("contextmenu", listener);
    });

    listeners.length = 0;

    const liveQueryIndicator =
      appContainer.querySelectorAll(".custom-query .th");

    if (liveQueryIndicator.length > 0) {
      Array.from(liveQueryIndicator).forEach((element) => {
        const contextMenuListener = (event: Event) => {
          event.preventDefault();
          const parentQueryElement = element.closest(".custom-query");

          if (parentQueryElement != null) {
            parentQueryElement.classList.toggle("active");
          }
        };

        (element as HTMLElement).addEventListener(
          "contextmenu",
          contextMenuListener
        );
        listeners.push({ element, listener: contextMenuListener });
      });
    }
  }

  logseq.App.onRouteChanged(() => {
    resetListeners();
  });

  resetListeners();

  const mutationObserver = new MutationObserver(() => {
    resetListeners();
  });

  const app = parent.document.getElementById("app-container");

  if (app) {
    mutationObserver.observe(app, {
      childList: true,
      subtree: true,
    });
  }
}

logseq.ready(main).catch(console.error);
