using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using FMODUnity;
using System;
using System.Runtime.InteropServices;

public class MusicManager : MonoBehaviour
{
    public static MusicManager instance;

    [SerializeField]
    [EventRef]
    private string music = null;

    public TimelineInfo timelineInfo = null;
    private GCHandle timelineHandler;

    private FMOD.Studio.EventInstance musicInstance;

    [SerializeField]
    private Slider volumeSlider;

    [SerializeField] [Range(0.0f, 1.0f)]
    private float initialVolume = 0.0f;
    public float Volume { get; private set; }

    private FMOD.Studio.EVENT_CALLBACK beatCallback;

    [StructLayout(LayoutKind.Sequential)]
    public class TimelineInfo
    {
        public int currentBeat = 0;
        public int timeSignatureUpper = 4;
        //public int timeSignatureLower;
        public FMOD.StringWrapper lastMarker = new FMOD.StringWrapper();
    }

    public delegate void BeatEventDelegate();
    public static event BeatEventDelegate beatUpdated;

    public delegate void TimeSignatureListenerDelegate();
    public static event TimeSignatureListenerDelegate timeSignatureUpdated;

    public delegate void MarkerListenerDelegate();
    public static event MarkerListenerDelegate markerUpdated;

    public static int lastBeat = 0;

    public static int lastTimeSignatureUpper = 4;
    //public static int lastTimeSignatureLower; 

    public static string lastMarkerString = null;

    public void UpdateComplexity(int complexity)
    {
        if (music != null)
        {
            musicInstance.setParameterByName("Complexity", complexity);
        }
    }

    public void UpdateTimeSignature(int timeSignature)
    {
        if (music != null)
        {
            musicInstance.setParameterByName("TimeSignature", timeSignature);
        }
    }

    private void Awake()
    {
        instance = this;

        if (music != null)
        {
            musicInstance = RuntimeManager.CreateInstance(music);
            musicInstance.start();
            musicInstance.setVolume(initialVolume);
            volumeSlider.value = initialVolume;
            Volume = initialVolume;
        }
    }

    private void Start()
    {
        if (music != null)
        {
            timelineInfo = new TimelineInfo();
            beatCallback = new FMOD.Studio.EVENT_CALLBACK(BeatEventCallback);
            timelineHandler = GCHandle.Alloc(timelineInfo, GCHandleType.Pinned);
            musicInstance.setUserData(GCHandle.ToIntPtr(timelineHandler));
            musicInstance.setCallback(beatCallback, FMOD.Studio.EVENT_CALLBACK_TYPE.TIMELINE_BEAT | FMOD.Studio.EVENT_CALLBACK_TYPE.TIMELINE_MARKER);
        }
    }

    private void Update()
    {
        UpdateVolume();

        if (lastMarkerString != timelineInfo.lastMarker)
        {
            lastMarkerString = timelineInfo.lastMarker;

            if (markerUpdated != null)
            {
                markerUpdated();
            }
        }

        if (lastBeat != timelineInfo.currentBeat)
        {
            lastBeat = timelineInfo.currentBeat;

            if (beatUpdated != null)
            {
                beatUpdated();
            }
        }

        if (lastTimeSignatureUpper != timelineInfo.timeSignatureUpper) //|| lastTimeSignatureLower != timelineInfo.timeSignatureLower)
        {
            lastTimeSignatureUpper = timelineInfo.timeSignatureUpper;
            //lastTimeSignatureLower = timelineInfo.timeSignatureLower;

            if (timeSignatureUpdated != null)
            {
                timeSignatureUpdated();
            }
        }

        

    }

    private void UpdateVolume()
    {
        if (Input.GetKey(KeyCode.Q))
        {
            Volume = Mathf.Clamp(Volume + 0.0005f, 0.0f, 1.0f);
            FMOD.RESULT result = musicInstance.setVolume(Volume);
            if (result != FMOD.RESULT.OK)
            {
                print(result);
            }
            else
            {
                volumeSlider.value = Volume;
            }
        }

        if (Input.GetKey(KeyCode.Z))
        {
            Volume = Mathf.Clamp(Volume - 0.0005f, 0.0f, 1.0f);
            FMOD.RESULT result = musicInstance.setVolume(Volume);
            if (result != FMOD.RESULT.OK)
            {
                print(result);
            }
            else
            {
                volumeSlider.value = Volume;
            }
        }
    }

    private void OnDestroy()
    {
        musicInstance.setUserData(IntPtr.Zero);
        musicInstance.stop(FMOD.Studio.STOP_MODE.ALLOWFADEOUT);
        musicInstance.release();
        timelineHandler.Free();
    }

#if UNITY_EDITOR
    private void OnGUI()
    {
        GUILayout.Box($"Current Beat = {timelineInfo.currentBeat}, Last Marker = {(string)timelineInfo.lastMarker}, Time Signature Upper = {timelineInfo.timeSignatureUpper}");
    }
#endif

    [AOT.MonoPInvokeCallback(typeof(FMOD.Studio.EVENT_CALLBACK))]
    static FMOD.RESULT BeatEventCallback(FMOD.Studio.EVENT_CALLBACK_TYPE type, IntPtr instancePtr, IntPtr parameterPtr)
    {
        FMOD.Studio.EventInstance instance = new FMOD.Studio.EventInstance(instancePtr);

        IntPtr timelineInfoPtr;
        FMOD.RESULT result = instance.getUserData(out timelineInfoPtr);

        if (result != FMOD.RESULT.OK)
        {
            Debug.LogError("Timeline Callback error: " + result);
        }
        else if (timelineInfoPtr != IntPtr.Zero)
        {
            GCHandle timelineHandle = GCHandle.FromIntPtr(timelineInfoPtr);
            TimelineInfo timelineInfo = (TimelineInfo)timelineHandle.Target;

            switch(type)
            {
                case FMOD.Studio.EVENT_CALLBACK_TYPE.TIMELINE_BEAT:
                    {
                        var parameter = (FMOD.Studio.TIMELINE_BEAT_PROPERTIES)Marshal.PtrToStructure(parameterPtr, typeof(FMOD.Studio.TIMELINE_BEAT_PROPERTIES));
                        timelineInfo.currentBeat = parameter.beat;
                        timelineInfo.timeSignatureUpper = parameter.timesignatureupper;
                        //timelineInfo.timeSignatureLower = parameter.timesignaturelower;
                    }
                    break;
                case FMOD.Studio.EVENT_CALLBACK_TYPE.TIMELINE_MARKER:
                    {
                        var parameter = (FMOD.Studio.TIMELINE_MARKER_PROPERTIES)Marshal.PtrToStructure(parameterPtr, typeof(FMOD.Studio.TIMELINE_MARKER_PROPERTIES));
                        timelineInfo.lastMarker = parameter.name;
                    }
                    break;
            }
        }

        return FMOD.RESULT.OK;
    }
}
