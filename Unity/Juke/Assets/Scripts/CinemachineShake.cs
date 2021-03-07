using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Cinemachine;

public class CinemachineShake : MonoBehaviour
{
    public static CinemachineShake Instance { get; private set; }

    private CinemachineVirtualCamera vcam;

    private float shakeTimer;
    private float shakeTimerTotal;
    private float startingIntensity;

    private void Awake()
    {
        Instance = this;
        vcam = GetComponent<CinemachineVirtualCamera>();
    }

    private void Update()
    {
        if (shakeTimer > 0.0f)
        {
            shakeTimer -= Time.deltaTime;
            CinemachineBasicMultiChannelPerlin noise =
                    vcam.GetCinemachineComponent<CinemachineBasicMultiChannelPerlin>();
            noise.m_AmplitudeGain = Mathf.Lerp(startingIntensity, 0.0f, shakeTimer / shakeTimerTotal);
        }
    }

    public void ShakeCamera(float intensity, float duration)
    {
        CinemachineBasicMultiChannelPerlin noise =
            vcam.GetCinemachineComponent<CinemachineBasicMultiChannelPerlin>();

        noise.m_AmplitudeGain = intensity;
        startingIntensity = intensity;

        shakeTimerTotal = duration;
        shakeTimer = duration;
    }
}
