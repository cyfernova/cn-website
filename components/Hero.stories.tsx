import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import TileBoard from "./Hero";

/**
 * TileBoard is an interactive tile board component with flip animations.
 * It creates a 6x6 grid of tiles that respond to mouse interactions.
 *
 * Features:
 * - Interactive tiles that animate on hover
 * - Flip all tiles with a button
 * - Mouse tracking with highlight effect
 * - GSAP-powered animations
 */
const meta: Meta<typeof TileBoard> = {
    title: "Components/Hero",
    component: TileBoard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "An interactive 3D tile board with animations powered by GSAP. The tiles flip on hover and can all be flipped simultaneously.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof TileBoard>;

/**
 * Default story showing the TileBoard in its initial state.
 */
export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: "The default view of the tile board with interactive hover effects and a flip button.",
            },
        },
    },
};
