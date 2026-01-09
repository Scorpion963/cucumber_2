import React, {
  CSSProperties,
  forwardRef,
  SetStateAction,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  ImageRestriction,
  FixedCropper,
  FixedCropperRef,
  FixedCropperProps,
  CropperFade,
  CropperState,
  ExtendedSettings,
  CropperRef,
  Coordinates,
} from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import {
  getAbsoluteZoom,
  getZoomFactor,
} from "advanced-cropper/extensions/absolute-zoom";
import { Slider } from "@/components/ui/slider";
import { Check, X } from "lucide-react";
import { Button } from "./ui/button";

export type CustomCropperProps = FixedCropperProps &
  CropperFadeTypes & {
    onCropSuccess: (e: string) => void;
  };

export type CustomCropperRef = FixedCropperRef;

export type CropperFadeTypes = {
  fadeStyle?: CSSProperties;
  fadeClassName?: string;
};

export const FixedCropperWithSlider = forwardRef<
  CustomCropperRef,
  CustomCropperProps
>(
  (
    {
      stencilProps,
      fadeStyle,
      fadeClassName,
      onCropSuccess,
      ...props
    },
    ref
  ) => {
    const [state, setState] = useState<CropperState | null>(null);
    const [settings, setSettings] = useState<ExtendedSettings | null>(null);
    const experimentRef = useRef<FixedCropperRef | null>(null);
    const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
    const [image, setImage] = useState<string>();
    useImperativeHandle(ref, () => experimentRef.current!, []);

    const onZoom = (value: number, transitions?: boolean) => {
      if (!experimentRef.current || !settings) return;
      console.log("zooming");
      experimentRef.current.zoomImage(getZoomFactor(state, settings, value), {
        transitions: !!transitions,
      });
    };

    const onCrop = async () => {
      if (experimentRef.current) {
        setCoordinates(experimentRef.current.getCoordinates());
        const cropped = experimentRef.current.getCanvas()?.toDataURL();
        if (cropped) {
          setImage(cropped);
          onCropSuccess(cropped);
        } else {
          console.log("the crop was unsuccessfull");
        }
      }
    };

    return (
      <div className="flex flex-col gap-4 p-4 rounded-lg bg-card">
        <div className="flex gap-2 items-center font-bold text-lg">
          <X />
          <div>Drag to resize</div>
        </div>
        <CropperFade
          style={fadeStyle}
          className={fadeClassName}
          visible={!!state} // state && true
        >
          <FixedCropper
            ref={experimentRef}
            src={props.src}
            stencilProps={{
              handlers: false,
              lines: false,
              movable: false,
              resizable: false,
              ...stencilProps,
            }}
            className="rounded-lg"
            onChange={(cropper) => {
              setState(cropper.getState());
              setSettings(cropper.getSettings());
            }}
            imageRestriction={ImageRestriction.stencil}
            {...props}
          />
        </CropperFade>
        <div className="flex gap-2">
          <Slider
            max={90}
            onValueChange={(e) => {
              onZoom(Math.min(1, Math.max(0, e[0] / 100)));
            }}
          />
          <Button
            onClick={() => onCrop()}
            className="rounded-full px-3 py-5 cursor-pointer dark:px-3 dark:py-5"
          >
            <Check />
          </Button>
        </div>
      </div>
    );
  }
);

FixedCropperWithSlider.displayName = "CustomCropper";
