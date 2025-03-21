﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Cinemachine;

public class Player : MonoBehaviour
{
    [SerializeField]
    private float normalSpeed = 8.0f;

    [SerializeField]
    private float fastSpeed = 16.0f;

    [SerializeField]
    private float slowSpeed = 4.0f;

    private float speed;

    [SerializeField]
    private float jumpForce = 10.0f;

    private bool isFrozen;

    private float horizontal;
    private bool isSpaceDown;

    private Rigidbody2D rb;
    private Animator animator;

    private bool isGrounded = false;

    [SerializeField]
    private Transform isGroundedChecker;

    [SerializeField]
    private float checkGroundRadius = 0.5f;

    [SerializeField]
    private LayerMask groundLayer;

    [SerializeField]
    private float fallMultiplier = 2.5f;

    [SerializeField]
    private float lowJumpMultiplier = 2f;

    [SerializeField]
    private float rememberGroundedFor = 0.1f;

    private float lastTimeGrounded;

    [SerializeField] [Range(0, 100)]
    private int defaultAdditionalJumps = 1;

    private int additionalJumps;

    [SerializeField]
    private GameObject heart;

    private Animator heartbeatAnimator;

    private CinemachineImpulseSource impulseGenerator;

    private void Awake()
    {
        speed = normalSpeed;
        isFrozen = false;
        rb = GetComponent<Rigidbody2D>();
        animator = GetComponent<Animator>();
        heartbeatAnimator = heart.GetComponent<Animator>();
        impulseGenerator = GetComponent<CinemachineImpulseSource>();
        MusicManager.BeatUpdated += Pulse;
    }

    private void Update()
    {
        horizontal = Input.GetAxisRaw("Horizontal");

        if (!isSpaceDown)
        {
            isSpaceDown = Input.GetKeyDown(KeyCode.Space);
        }

        if (!isFrozen)
        {
            CheckIfGrounded();
        }

        UpdateHeartbeat();
    }

    private void FixedUpdate()
    {
        if (!isFrozen)
        {
            Move();
            Jump();
            BetterJump();
        }
        isSpaceDown = false;

        // animator.SetBool("IsWalking", rb.velocity.x != 0 && isGrounded);
    }

    private void OnDestroy()
    {
        MusicManager.BeatUpdated -= Pulse;
    }

    private void Move()
    {
        float moveBy = horizontal * speed;
        rb.velocity = new Vector2(moveBy, rb.velocity.y);
    }

    private void Jump()
    {
        if (isSpaceDown && (isGrounded || Time.time - lastTimeGrounded <= rememberGroundedFor || additionalJumps > 0))
        {
            rb.velocity = new Vector2(rb.velocity.x, jumpForce);
            additionalJumps--;
        }
    }

    private void BetterJump()
    {
        if (rb.velocity.y < 0)
        {
            rb.velocity += Vector2.up * Physics2D.gravity * (fallMultiplier - 1) * Time.deltaTime;
        }
        else if (rb.velocity.y > 0 && !Input.GetKey(KeyCode.Space))
        {
            rb.velocity += Vector2.up * Physics2D.gravity * (lowJumpMultiplier - 1) * Time.deltaTime;
        }
    }

    private void CheckIfGrounded()
    {
        Collider2D collider = Physics2D.OverlapCircle(isGroundedChecker.position, checkGroundRadius, groundLayer);
        if (collider != null)
        {
            isGrounded = true;
            additionalJumps = defaultAdditionalJumps;
        }
        else
        {
            if (isGrounded)
            {
                lastTimeGrounded = Time.time;
            }
            isGrounded = false;
        }
    }

    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.CompareTag("FastBackground"))
        {
            speed = fastSpeed;
            rb.gravityScale = 1.0f;
        }
        else if (collision.CompareTag("SlowBackground"))
        {
            speed = slowSpeed;
            rb.gravityScale = 1.0f;
        }
        else if (collision.CompareTag("HighBackground"))
        {
            speed = normalSpeed;
            rb.gravityScale = 0.5f;
        }
        else if (collision.CompareTag("LowBackground"))
        {
            speed = normalSpeed;
            rb.gravityScale = 2.0f;
        }
        else if (collision.CompareTag("4-4Background"))
        {
            MusicManager.instance.UpdateTimeSignature(0);
        }
        else if (collision.CompareTag("3-4Background"))
        {
            MusicManager.instance.UpdateTimeSignature(1);
        }
        else if (collision.CompareTag("2-4Background"))
        {
            MusicManager.instance.UpdateTimeSignature(2);
        }
    }

    private void OnTriggerExit2D(Collider2D collision)
    {
        if (collision.CompareTag("FastBackground") || collision.CompareTag("SlowBackground") || collision.CompareTag("HighBackground") || collision.CompareTag("LowBackground"))  //&& currentSnapshot != normal)
        {
            speed = normalSpeed;
            rb.gravityScale = 1.0f;
        }
    }

    private void Pulse()
    {
        float volume = MusicManager.instance.Volume;
        animator.SetFloat("Volume", volume);
        animator.Play("Player_Red_Pulse");
        heartbeatAnimator.Play("Heartbeat");

        if (volume >= 0.8f)
        {
            impulseGenerator.GenerateImpulse();
            //CinemachineShake.Instance.ShakeCamera(Mathf.Lerp(0.1f, 0.5f, Mathf.InverseLerp(0.8f, 1.0f, volume)), 0.1f);
        }
        else
        {
            //CinemachineShake.Instance.ShakeCamera(0.0f, 0.1f);
        }
    }

    private void UpdateHeartbeat()
    {
        float volume = MusicManager.instance.Volume;
        animator.SetFloat("Volume", volume);
        // float newScale = Mathf.Lerp(0.3f, 3.0f, Mathf.InverseLerp(0.0f, 1.0f, volume));
        //var main = heartbeat.main;
        //main.startSize = newScale;
    }
}
