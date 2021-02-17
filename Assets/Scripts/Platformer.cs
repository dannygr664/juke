using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using FMODUnity;

public class Platformer : MonoBehaviour
{
    [SerializeField]
    private float normalSpeed;

    [SerializeField]
    private float fastSpeed;

    [SerializeField]
    private float slowSpeed;

    private float speed;

    [SerializeField]
    private float jumpForce;

    private bool isFrozen;

    private float horizontal;
    private bool isSpaceDown;

    private Rigidbody2D rb;

    private Animator animator;

    private bool isGrounded = false;

    [SerializeField]
    private Transform isGroundedChecker;

    [SerializeField]
    private float checkGroundRadius;

    [SerializeField]
    private LayerMask groundLayer;

    [SerializeField]
    private float fallMultiplier = 2.5f;

    [SerializeField]
    private float lowJumpMultiplier = 2f;

    [SerializeField]
    private float rememberGroundedFor;

    private float lastTimeGrounded;

    [SerializeField] [Range(0, 100)]
    private int defaultAdditionalJumps = 1;

    private int additionalJumps;

    private void Awake()
    {
        speed = normalSpeed;
        isFrozen = false;
        rb = GetComponent<Rigidbody2D>();
        animator = GetComponent<Animator>();
        MusicManager.beatUpdated += Pulse;
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

        animator.SetBool("IsWalking", rb.velocity.x != 0 && isGrounded);
    }

    private void OnDestroy()
    {
        MusicManager.beatUpdated -= Pulse;
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
        animator.Play("Player_Pulsing");
    }
}
