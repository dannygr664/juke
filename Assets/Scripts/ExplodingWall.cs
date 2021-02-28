using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ExplodingWall : MonoBehaviour
{
    private SpriteRenderer renderer;
    private Collider2D collider;
    private Animator animator;

    private bool hasExploded;

    public ParticleSystem explosion;

    private void Start()
    {
        renderer = GetComponent<SpriteRenderer>();
        collider = GetComponent<Collider2D>();
        animator = GetComponent<Animator>();
        MusicManager.BeatUpdated += Pulse;

        hasExploded = false;
    }

    public void Explode()
    {
        collider.isTrigger = true;
        explosion.Play();
    }

    private void OnDestroy()
    {
        MusicManager.BeatUpdated -= Pulse;
    }

    private void Pulse()
    {
        float volume = MusicManager.instance.Volume;
        if (volume < 0.8f)
        {
            animator.SetFloat("Volume", volume);
            animator.Play("Wall_Red_Pulse");
        }
        else
        {
            if (!hasExploded)
            {
                animator.Play("Wall_Explode");
                renderer.color = Color.clear;

            }
            hasExploded = true;
        }
    }
}
