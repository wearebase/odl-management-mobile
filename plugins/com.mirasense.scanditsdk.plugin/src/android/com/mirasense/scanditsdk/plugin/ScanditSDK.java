
//
//  Copyright 2010 Mirasense AG
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
//
//

package com.mirasense.scanditsdk.plugin;

import java.util.Iterator;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Intent;
import android.util.Log;


public class ScanditSDK extends CordovaPlugin {
    
    public static final String SCAN = "scan";
    
    private CallbackContext mCallbackContext;
    
    
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
        mCallbackContext = callbackContext;
        PluginResult result = null;
        
        if (action.equals(SCAN)) {
            scan(args);
            result = new PluginResult(Status.NO_RESULT);
            result.setKeepCallback(true);
            return true;
        } else {
            result = new PluginResult(Status.INVALID_ACTION);
            callbackContext.error("Invalid Action");
            return false;
        }
    }
    /**
     * Start scanning. The available options to pass this function are as
     * follows:
     *
     * exampleStringForOption: defaultValue
     * Short explanation of option.
     *
     * preferFrontCamera: false
     * Whether showing the front camera should be preferred over the back camera (for devices without a
     * front camera the back camera is shown).
     *
     * searchBar: true
     * Shows or hides the search bar at the top of the screen.
     *
     * 1DScanning: true
     * Enables or disables the recognition of 1D codes.
     *
     * 2DScanning: true
     * Enables or disables the recognition of 2D codes.
     *
     * ean13AndUpc12: true
     * Enables or disables the recognition of EAN13 and UPC12/UPCA codes.
     *
     * ean8: true
     * Enables or disables the recognition of EAN8 codes.
     *
     * upce: true
     * Enables or disables the recognition of UPCE codes.
     *
     * code39: true
     * Enables or disables the recognition of CODE39 codes.
     * Note: Not all Scandit SDK versions support Code 39 scanning.
     *
     * code128: true
     * Enables or disables the recognition of CODE128 codes.
     * Note: Not all Scandit SDK versions support Code 128 scanning.
     *
     * itf: true
     * Enables or disables the recognition of ITF codes.
     * Note: Not all Scandit SDK versions support ITF scanning.
     *
     * gs1DataBar: false
     * Enables or disables the recognition of GS1 DataBar codes.
     * Note: Not all Scandit SDK versions support GS1 DataBar scanning.
     *
     * gs1DataBarExpanded: false
     * Enables or disables the recognition of GS1 DataBar Expanded codes.
     * Note: Not all Scandit SDK versions support GS1 DataBar Expanded scanning.
     *
     * qr: false
     * Enables or disables the recognition of QR codes.
     *
     * dataMatrix: false
     * Enables or disables the recognition of Data Matrix codes.
     * Note: Not all Scandit SDK versions support Data Matrix scanning.
     *
     * pdf417: false
     * Enables or disables the recognition of PDF417 codes.
     * Note: Not all Scandit SDK versions support PDF417 scanning.
     *
     * msiPlessey: false
     * Enables or disables the recognition of MSI Plessey codes.
     * Note: Not all Scandit SDK versions support MSI Plessey scanning.
     *
     * msiPlesseyChecksumType: "mod10"
     * Sets the type of checksum that is expected of the MSI Plessey codes.
     * Legal values are: "none", "mod10", "mod11", "mod1010", "mod1110"
     *
     * inverseRecognition: false
     * Enables the detection of white on black codes. This option currently
     * only works on Data Matrix codes.
     *
     * microDataMatrix: false
     * Enables special settings to allow the recognition of very small Data
     * Matrix codes. If this is not specifically needed, do not enable it as it
     * uses considerable processing power. This setting automatically forces
     * 2d recognition on every frame. This option only works on devices with
     * Android 2.2 or higher, it does not cause issues with lower versions but
     * simply doesn't work.
     *
     * force2d: false
     * Forces the engine to always run a 2d recognition, ignoring whether a 2d
     * code was detected in the current frame.
     *
     * scanningHotSpot: "0.5/0.5" (x/y)
     * Changes the location of the spot where the recognition actively scans for
     * barcodes. X and y can be between 0 and 1, where 0/0 is the top left corner
     * and 1/1 the bottom right corner.
     *
     * scanningHotSpotHeight: 0.25
     * Changes the height of the spot where the recognition actively scans for
     * barcodes. The height of the hot spot is given relative to the height of
     * the screen and has to be between 0.0 and 0.5.
     * Be aware that if the hot spot height is very large, the engine is forced
     * to decrease the quality of the recognition to keep the speed at an
     * acceptable level.
     *
     * ignorePreviewAspectRatio: false
     * Normally the picker adjusts to the aspect ratio of the preview image. If
     * this is called, it will no longer do this.
     * Warning: If the aspect ratio is not kept, the camera feed may be
     * stretched and no longer be a proper representation of what is recorded.
     *
     * searchBar: false
     * Adds (or removes) a search bar to the top of the scan screen.
     *
     * titleBar: true
     * Adds (or removes) the title bar at the top of the scan screen.
     * This parameter is deprecated but retained for use with the old GUI which is
     * superseeded by the new 3.0 GUI that does not have a title bar anymore.
     *
     * toolBar: true
     * Adds (or removes) the tool bar at the bottom of the scan screen.
     * This parameter is deprecated but retained for use with the old GUI which is
     * superseeded by the new 3.0 GUI that does not have a tool bar anymore.
     *
     * beep: true
     * Enables or disables the sound played when a code was recognized.
     *
     * vibrate: true
     * Enables or disables the vibration when a code was recognized.
     *
     * torch: true
     * Enables or disables the icon that let's the user activate the LED torch
     * mode. If the device does not support torch mode, the icon to activate is
     * will not be visible regardless of the value.
     *
     * torchButtonPositionAndSize: "0.05/0.01/67/33" (x/y/width/height)
     * Sets the position at which the button to enable the torch is drawn. The X and Y coordinates are
     * relative to the screen size, which means they have to be between 0 and 1.
     *
     * cameraSwitchVisibility: "never"
     * Sets when the camera switch button is visible for all devices that have more than one camera.
     * Legal values are: "never", "tablet", "always"
     *
     * cameraSwitchButtonPositionAndSize: "0.05/0.01/67/33" (x/y/width/height)
     * Sets the position at which the button to switch the camera is drawn. The X and Y coordinates are
     * relative to the screen size, which means they have to be between 0 and 1. Be aware that the x
     * coordinate is calculated from the right side of the screen and not the left like with the torch
     * button.
     *
     * logoOffsets: "0, 0, 0, 0" (xOffset, yOffset, landscapeXOffset, landscapeYOffset)
     * Sets the x and y offset at which the Scandit logo should be drawn for both portrait and landscape
     * orientation. Be aware that the standard Scandit SDK licenses do not allow you to hide the logo.
     *
     * titleMessage: "Scan a barcode"
     * Sets the title shown at the top of the screen.
     *
     * leftButtonCaption: "KEYPAD"
     * Sets the caption of the left button.
     * Deprecated: This string is only used in the old GUI.
     *
     * leftButtonCaptionWhenKeypadVisible: "OK"
     * Sets the caption of the left button when the keypad is visible.
     *
     * rightButtonCaption: "CANCEL"
     * Sets the caption of the right button.
     *
     * rightButtonCaptionWhenKeypadVisible: "CANCEL"
     * Sets the caption of the right button when the keypad is visible.
     *
     * searchBarHint: "Scan barcode or enter it here"
     * Sets the text shown in the manual entry field when nothing has been
     * entered yet.
     *
     * viewfinderSize: "0.8/0.4/0.6/0.4" (width/height/landscapeWidth/landscapeHeight)
     * Sets the size of the viewfinder relative to the size of the screen size.
     * Changing this value does not(!) affect the area in which barcodes are successfully recognized.
     * It only changes the size of the box drawn onto the scan screen.
     *
     * viewfinderColor: "FFFFFF"
     * Sets the color of the viewfinder when no code has been recognized yet.
     *
     * viewfinderDecodedColor: "00FF00"
     * Sets the color of the viewfinder once the barcode has been recognized.
     *
     * zoom: 0.4
     * Sets the zoom to the given percentage of the max zoom possible.
     */
    private void scan(JSONArray data) {
        Intent intent = new Intent(cordova.getActivity(), ScanditSDKActivity.class);
        try {
            intent.putExtra("appKey", data.getString(0));
        } catch (JSONException e) {
            Log.e("ScanditSDK", "Function called through Java Script contained illegal objects.");
            e.printStackTrace();
            return;
        }
        
        if (data.length() > 1) {
            // We extract all options and add them to the intent extra bundle.
            try {
                JSONObject options = data.getJSONObject(1);
                @SuppressWarnings("unchecked")
                Iterator<String> iter = (Iterator<String>) options.keys();
                while (iter.hasNext()) {
                    String key = iter.next();
                    Object obj = options.opt(key);
                    if (obj != null) {
                        if (obj instanceof Integer) {
                            intent.putExtra(key, (Integer) obj);
                        } else if (obj instanceof Boolean) {
                            intent.putExtra(key, (Boolean) obj);
                        } else if (obj instanceof String) {
                            intent.putExtra(key, (String) obj);
                        }
                    }
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        cordova.startActivityForResult(this, intent, 1);
    }
    
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (resultCode == ScanditSDKActivity.SCAN) {
            String barcode = data.getExtras().getString("barcode");
            String symbology = data.getExtras().getString("symbology");
            JSONArray args = new JSONArray();
            args.put(barcode);
            args.put(symbology);
            mCallbackContext.success(args);
            
        } else if (resultCode == ScanditSDKActivity.MANUAL) {
            String barcode = data.getExtras().getString("barcode");
            JSONArray args = new JSONArray();
            args.put(barcode);
            args.put("UNKNOWN");
            mCallbackContext.success(args);
            
        } else if (resultCode == ScanditSDKActivity.CANCEL) {
        	mCallbackContext.error("Canceled");
        }
    }
}
