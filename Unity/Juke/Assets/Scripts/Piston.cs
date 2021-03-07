using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Piston : MonoBehaviour
{
    private SpriteRenderer renderer;

    [SerializeField]
    private float pulseTime;

    private float pistonCounter;
    private float volume;

    private void Start()
    {
        renderer = GetComponent<SpriteRenderer>();
        pistonCounter = 0.0f;
        MusicManager.BeatUpdated += Pulse;
    }

    private void Update()
    {
        if (pistonCounter > 0.0f)
        {
            transform.localScale = new Vector3(transform.localScale.x, Mathf.Lerp(0.0f, volume * 2.0f, pistonCounter));
            pistonCounter -= Time.deltaTime;

            if (pistonCounter <= 0.0f)
            {
                transform.localScale = new Vector3(transform.localScale.x, 0.0f);
            }
        }
    }

    private void OnDestroy()
    {
        MusicManager.BeatUpdated -= Pulse;
    }

    private void Pulse()
    {
        volume = MusicManager.instance.Volume;
        if (volume > 0.8f)
        {
            renderer.color = Color.clear;
        }
        pistonCounter = pulseTime;
    }
}
