import { cn } from "@/lib/utils";

// The gold a block of type stands on once there is a photograph under it.
// Two nested boxes because the pool's falloff is the product of a fade across
// and a fade down — nesting multiplies them without relying on
// `mask-composite`. Anchored to the block rather than to the section, so it
// tracks the type at every width and the ground either side of it stays
// photographic. Static: the stage turns, the light the words read by does not.
export function GroundLift({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("ground-lift pointer-events-none", className)}
    >
      <div className="ground-lift-pool absolute inset-0" />
    </div>
  );
}
