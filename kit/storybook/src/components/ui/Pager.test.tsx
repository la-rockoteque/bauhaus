import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/render";
import { Pager } from "./Pager";

/**
 * The `.mo-pager` primitive: the position between its buttons, and the buttons that stop at each
 * end. The caller owns the wording and the clamping.
 */
describe("Pager", () => {
  const labels = { previous: "Précédent", next: "Suivant", nav: "Pagination" };

  it("reads the position as « page / total » unless the caller names it", () => {
    const { rerender } = renderWithProviders(
      <Pager page={2} totalPages={5} onPageChange={vi.fn()} labels={labels} />,
    );
    expect(screen.getByText("2 / 5")).toBeInTheDocument();

    rerender(
      <Pager
        page={2}
        totalPages={5}
        onPageChange={vi.fn()}
        labels={{ ...labels, position: "Page 2 de 5" }}
      />,
    );
    expect(screen.getByText("Page 2 de 5")).toBeInTheDocument();
    expect(screen.queryByText("2 / 5")).toBeNull();
  });

  it("renders nothing for a single page", () => {
    renderWithProviders(
      <Pager page={1} totalPages={1} onPageChange={vi.fn()} labels={labels} />,
    );

    expect(screen.queryByRole("navigation")).toBeNull();
  });

  it("shows the info and the position of a single page, with no button, when the caller asks", () => {
    renderWithProviders(
      <Pager
        page={1}
        totalPages={1}
        onPageChange={vi.fn()}
        info="3 déclarations"
        labels={{ ...labels, position: "Page 1 de 1" }}
        showWhenSingle
      />,
    );

    const nav = screen.getByRole("navigation", { name: "Pagination" });
    expect(nav).toHaveTextContent("3 déclarations");
    expect(nav).toHaveTextContent("Page 1 de 1");
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders nothing with no page at all, even when a single page shows", () => {
    renderWithProviders(
      <Pager
        page={1}
        totalPages={0}
        onPageChange={vi.fn()}
        labels={labels}
        showWhenSingle
      />,
    );

    expect(screen.queryByRole("navigation")).toBeNull();
  });

  it("stops each button at its end, and moves one page at a time", async () => {
    const onPageChange = vi.fn();
    const { user, rerender } = renderWithProviders(
      <Pager
        page={1}
        totalPages={3}
        onPageChange={onPageChange}
        labels={labels}
      />,
    );
    expect(
      screen.getByRole("navigation", { name: "Pagination" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Précédent" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Suivant" }));
    expect(onPageChange).toHaveBeenLastCalledWith(2);

    rerender(
      <Pager
        page={3}
        totalPages={3}
        onPageChange={onPageChange}
        labels={labels}
      />,
    );
    expect(screen.getByRole("button", { name: "Suivant" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Précédent" }));
    expect(onPageChange).toHaveBeenLastCalledWith(2);
  });
});
